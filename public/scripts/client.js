class Client {
	constructor() {
		/*
            Initialisation de la connexion au serveur Websocket
            
            Note : Si le serveur web socket est accessible via la même adresse,
            on peut utiliser le raccourci vers le webroot : "/", qui équivaut 
            ici à : http://localhost:9000/
        */
		this.socket = io.connect('/'); // "socket" est un objet représentant ce socket client unique

		this.nickname = window.prompt('Choisissez un pseudonyme');

		// Dom elements

		/*
  
        Il faut variabiliser :
          - le formulaire
          - l'input
          - la liste des messages
  
  
        (document.querySelector est sûrement la clé)
  
        
  
        */

		/**
		 * Un gestionnaire d'événement de la websocket qui écoute l'évenement nommé comme un peu plus bas (https://socket.io/docs/v3/listening-to-events/)
		 */
	}

	/**
	 * Permet d'initialiser les gestionnaires d'événément pour le client
	 * (validation du formulaire, clic sur un channel ... etc)
	 */
	init() {
		// Ici on ajoute un gestionnaire d'événement sur le formulaire afin de déclencher la méthode sendMessage de notre classe
	}

	/**
	 * Émet un message de ce client vers le serveur
	 * @param {string} message le message envoyé par le client
	 */
	sendMessage(message) {
		/*
      
      * Ici on emet un event dans la websocket (https://socket.io/docs/v3/emitting-events/) que l'on va nommer "message:new"
      * ⚠️ L'objet qui sera envoyé doit respecter la forme { nickname: value, message: value} ⚠️
      */
	}

	/**
	 * Reçoit un message d'un autre tchatteur de la part du serveur
	 * @param {string} nickname le pseudo du client
	 * @param {string} message le message reçu
	 */
	receiveMessage(nickname, message) {
		/**
		 * Ici on affiche le message dans le dom
		 *
		 * L'ordre doit être inversé, c'est à dire que le dernier message envoyé (dans l'ordre chronologique) doit être le premier de la liste
		 */
	}
}
