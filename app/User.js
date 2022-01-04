class User {
	/**
	 *
	 * @param {*} socket
	 * @param {*} nickname
	 */
	constructor() {
		/**
		 * @var {string} id l'id du user sur la socket
		 * @var {string} nickname le pseudo de l'utilisateur
		 * @var {socket} socket la socket
		 */
	}

	/**
	 * Permet de deconnecter un user
	 */

	destroy() {
		/**
		 * Il faudra set id et nickname à null
		 * Puis délencher la méthode permettant de déconnecter un user de la socket (disconnect ?)
		 */
	}
}

module.exports = User;
