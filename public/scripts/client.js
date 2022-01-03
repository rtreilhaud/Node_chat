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

		this.form = document.querySelector('#chat-form');
		this.input = document.querySelector('#message');
		this.messageList = document.querySelector('#message-list');
		this.messages = [];

		/*
            Un gestionnaire d'événement de la websocket qui écoute l'évenement nommé comme un peu plus bas (https://socket.io/docs/v3/listening-to-events/)
        */

		this.socket.on('message:new', ({ nickname, message }) =>
			this.receiveMessage(nickname, message)
		);
	}

	/**
	 * Permet d'initialiser les gestionnaires d'événément pour le client
	 * (validation du formulaire, clic sur un channel ... etc)
	 */
	init() {
		// Ici on ajoute un gestionnaire d'événement sur le formulaire afin de déclencher la méthode sendMessage de notre classe
		this.form.addEventListener('submit', (event) => {
			event.preventDefault();
			this.sendMessage(this.input.value);
			this.input.value = '';
		});
	}

	/**
	 * Émet un message de ce client vers le serveur
	 * @param {string} message le message envoyé par le client
	 */
	sendMessage(message) {
		/*
            Ici on emet un event dans la websocket (https://socket.io/docs/v3/emitting-events/) que l'on va nommer "message:new"
            ⚠️ L'objet qui sera envoyé doit respecter la forme { nickname: value, message: value} ⚠️
        */
		this.socket.emit('message:new', {
			nickname: this.nickname,
			message: message
		});
	}

	/**
	 * Reçoit un message d'un autre tchatteur de la part du serveur
	 * @param {string} nickname le pseudo du client
	 * @param {string} message le message reçu
	 */
	receiveMessage(nickname, message) {
		/*
            Ici on affiche le message dans le dom
            
            L'ordre doit être inversé, c'est à dire que le dernier message envoyé (dans l'ordre chronologique) doit être le premier de la liste
		 */
		this.messages.unshift({ nickname, message });

		console.log(this.messages);

		this.messageList.replaceChildren();

		for (const msg of this.messages) {
			console.log(msg);
			const hr = document.createElement('hr');
			hr.classList = 'mt-0 mb-3';
			const p = document.createElement('p');
			const nickname = document.createElement('span');
			nickname.classList = 'fw-bold bg-info p-1 me-1';
			nickname.textContent = msg.nickname;
			p.append(nickname, msg.message);
			this.messageList.append(hr, p);
		}
	}
}
