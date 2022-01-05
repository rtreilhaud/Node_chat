const User = require('./User');
const Channel = require('./Channel');

class Chat {
	/**
	 *
	 * @param {*} io une instance de la socket
	 * @param {[string]} channels
	 */
	constructor(
		io,
		channels = ['general', 'gaming', 'random'],
		defaultChannel = 'general'
	) {
		/**
		 * @const {socket} io
		 * @const {Array} users la liste des utilisateurs
		 * @const {Array} messages la liste des messages
		 */

		this.io = io;
		this.users = [];
		this.messages = [];

		// Create the channels
		for (const channel of channels) {
			this[channel] = new Channel(io, channel);
		}

		this.defaultChannel = defaultChannel;
	}

	/**
	 * Gestion des événements de connexion à la socket
	 *
	 * @param {*} socket
	 */
	onConnection(socket) {
		/**
		 * Un gestionnaire d'événement unique (https://socket.io/docs/v4/listening-to-events/#socketonceeventname-listener) qui va gérer l'evenement qui sera trigger lorsqu'un User choisi son pseudo 'user:nickname'
		 *
		 * Il devra :
		 *  - instancier un user puis l'ajouter à liste des users
		 *  - Trigger l'event user:list vers TOUS les clients connectés
		 *  - Mettre en place deux gestionnaire d'événement sur les events ['message:new', 'disconnect']
		 */

		socket.once('user:nickname', (nickname) => {
			const user = new User(socket, nickname);
			this.users.push(user);

			this.joinChannel(user, this.defaultChannel);

			socket.on('message:new', (message) => {
				this._onNewMessage(user, message);
			});

			socket.on('disconnect', () => {
				const previousUsers = this.users.map((user) => user.id);
				const currentSockets = this.io.sockets.sockets;
				const disconnectedID = previousUsers.filter(
					(userID) => !currentSockets.has(userID)
				)[0];
				const disconnectedUser = this.users.filter(
					(user) => user.id === disconnectedID
				)[0];
				this._onUserDisconnect(disconnectedUser);
			});

			socket.on('notify:typing', (nickname) => {
				this.io
					.to(this.getCurrentChannel(user))
					.emit('notify:typing', nickname);
			});

			socket.on('channel:change', (channel) => {
				// Join the new channel
				this.joinChannel(user, channel);

				// Leave the other channels
				for (const room of socket.rooms) {
					if (room !== socket.id && room !== channel) {
						this.leaveChannel(user, room);
					}
				}
			});
		});
	}

	/**
	 *
	 * @param {User} user
	 */
	_onUserDisconnect(user) {
		/**
		 * Il faut retirer notre user de la liste des utilisateurs puis le deconnecter
		 * Suite à ça il faudra déclencher l'event 'user:list'
		 */
		this.users = this.users.filter((u) => u != user);

		user.destroy();

		this.io.sockets.emit('user:list', this.getUsernamesList());
	}

	getCurrentChannel(user) {
		return [...user.socket.rooms].filter((room) => room !== user.id)[0];
	}

	/**
	 *
	 * @param {User} user L'utilisateur ayant écrit le message
	 * @param {String} message Le texte du message
	 */
	_onNewMessage(user, message) {
		this.io.to(this.getCurrentChannel(user)).emit('message:new', {
			nickname: user.nickname,
			message: message
		});
	}

	/**
	 *
	 * @returns {Array} la liste des "nicknames" prise dans la liste des users
	 */
	getUsernamesList(channel) {
		return this[channel].getUsersList().map((user) => user.nickname);
	}

	sendUsernamesList(channel) {
		this.io.to(channel).emit('user:list', this.getUsernamesList(channel));
	}

	joinChannel(user, channel) {
		user.socket.join(channel);
		this[channel].pushUser(user);
		this.sendUsernamesList(channel);
	}

	leaveChannel(user, channel) {
		user.socket.leave(channel);
		this[channel].removeUser(user);
		this.sendUsernamesList(channel);
	}
}

module.exports = Chat;
