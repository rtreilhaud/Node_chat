class Client {
	constructor() {
		/*
            Initialisation de la connexion au serveur Websocket
            
            Note : Si le serveur web socket est accessible via la même adresse,
            on peut utiliser le raccourci vers le webroot : "/", qui équivaut 
            ici à : http://localhost:9000/
        */
		this.socket = io.connect('/'); // "socket" est un objet représentant ce socket client unique

		this.nickname = window.prompt('Choose a nickname').trim();
		while (this.nickname === '') {
			this.nickname = window
				.prompt('You must choose a nickname whith at least 1 character!')
				.trim();
		}
		this.socket.emit('user:nickname', this.nickname);

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
		this.userList = document.querySelector('#user-list');
		this.notification = document.querySelector('#typing-notification');
		this.channels = document.querySelector('#channels');
		this.channel = 'general';

		this.changeChannel(this.channel);
		this.channels.addEventListener('click', ({ target }) => {
			this.changeChannel(target.textContent.trim());
		});

		/*
            Un gestionnaire d'événement de la websocket qui écoute l'évenement nommé comme un peu plus bas (https://socket.io/docs/v3/listening-to-events/)
        */

		this.socket.on('message:new', ({ nickname, message }) => {
			this.receiveMessage(nickname, message);

			// Clear typing notification
			this.clearTypingNotification();
		});

		this.socket.on('user:list', (users) => {
			this.displayUsers(users);
		});

		this.socket.on('notify:typing', (nickname) => {
			clearTimeout(this.timeoutID);
			this.displayTypingNotification(nickname);
			this.timeoutID = setTimeout(() => {
				this.clearTypingNotification();
			}, 5000);
		});
	}

	/**
	 * Permet d'initialiser les gestionnaires d'événément pour le client
	 * (validation du formulaire, clic sur un channel ... etc)
	 */
	init() {
		this.input.focus();
		// Ici on ajoute un gestionnaire d'événement sur le formulaire afin de déclencher la méthode sendMessage de notre classe
		this.form.addEventListener('submit', (event) => {
			event.preventDefault();
			if (this.input.value.trim() !== '') {
				this.sendMessage(this.input.value.trim());
			}
			this.input.value = '';
		});

		this.input.addEventListener('input', () => {
			this.socket.emit('notify:typing', this.nickname);
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
		this.socket.emit('message:new', message);
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
		const hr = document.createElement('hr');
		hr.classList = 'mt-0 mb-3';
		const p = document.createElement('p');
		const span = document.createElement('span');
		span.classList = 'fw-bold p-1 me-1';
		span.classList += nickname === this.nickname ? ' bg-info' : ' bg-secondary';
		span.textContent = nickname;
		p.append(span, message);
		this.messageList.prepend(hr, p);
	}

	displayUsers(users) {
		this.userList.innerHTML = '';
		for (const user of users) {
			const li = document.createElement('li');
			li.textContent = user;
			if (user === this.nickname) {
				li.classList = 'fw-bold';
			}
			this.userList.appendChild(li);
		}
	}

	displayTypingNotification(nickname) {
		if (nickname !== this.nickname) {
			this.notification.textContent = nickname + ' is typing...';
		}
	}

	clearTypingNotification() {
		this.notification.textContent = '';
	}

	changeChannel(channel) {
		this.channel = channel;
		this.socket.emit('channel:change', channel);
		// Clear messages
		this.messageList.innerHTML = '';

		for (const channel of this.channels.childNodes) {
			if (channel.textContent === this.channel) {
				channel.classList.add('fw-bold');
			} else {
				channel.classList.remove('fw-bold');
			}
		}
	}
}
