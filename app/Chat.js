const User = require('./User');

class Chat {
	/**
	 *
	 * @param {*} io une instance de la socket
	 */
	constructor(io) {
		/**
		 * @const {socket} io
		 * @const {Array} users la liste des utilisateurs
		 * @const {Array} messages la liste des messages
		 */

		this.io = io;
		this.users = [];
		this.messages = [];
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
		 *  - Trigger l'event user:list vers TOUTES les clients connectés
		 *  - Mettre en place deux gestionnaire d'événement sur les events ['message:new', 'disconnect']
		 */

		socket.once('user:nickname', (nickname) => {
			const user = new User(socket, nickname);
			this.users.push(user);
		});
	}

	/**
	 *
	 * @param {User} user
	 */
	_onUserDisconnect() {
		/**
		 * Il faut retirer notre user de la liste des utilisateurs puis le deconnecter
		 * Suite à ça il faudra déclencher l'event 'user:list'
		 */
	}

	/**
	 *
	 * @param {User} user L'utilisateur ayant écrit le message
	 * @param {String} message Le texte du message
	 */
	_onNewMessage(user, message) {
		// A vous de deviner
	}

	/**
	 *
	 * @returns {Array} la liste des "nicknames" prise dans la liste des users
	 */
	getUsernamesList() {}
}

module.exports = Chat;
