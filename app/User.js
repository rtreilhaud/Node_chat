class User {
	/**
	 *
	 * @param {*} socket
	 * @param {*} nickname
	 */
	constructor(socket, nickname) {
		/**
		 * @var {string} id l'id du user sur la socket
		 * @var {string} nickname le pseudo de l'utilisateur
		 * @var {socket} socket la socket
		 */

		this.id = socket.id;
		this.nickname = nickname;
		this.socket = socket; // "socket" est un objet représentant ce socket client unique
	}

	/**
	 * Permet de deconnecter un user
	 */
	destroy() {
		/**
		 * Il faudra set id et nickname à null
		 * Puis délencher la méthode permettant de déconnecter un user de la socket (disconnect ?)
		 */
		this.id = null;
		this.nickname = null;
		this.socket.disconnect(true);
	}
}

module.exports = User;
