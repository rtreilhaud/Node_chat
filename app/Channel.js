class Channel {
	constructor(io, title) {
		this.io = io;
		this.title = title; // Nom du channel
		this.users = []; // Chaque channel va gérer sa propre liste d'utilisateurs
	}

	pushUser(user) {
		if (!this.users.includes(user)) {
			console.log(`Client ${user.id} joined ${this.title}`);
			this.users.push(user);
		}
	}

	removeUser(user) {
		console.log(`Client ${user.id} leaved ${this.title}`);
		this.users = this.users.filter((u) => u != user);
	}

	getUsersList() {
		return this.users;
	}

	destroy() {}
}

module.exports = Channel;
