const http = require('http');
const express = require('express');
const app = express();
const port = 9000;
const server = http.Server(app);
const io = require('socket.io')(server);
const Chat = require('./app/Chat');
const chat = new Chat(io);

app.use(express.static('public'));

app.set('view engine', 'pug');

io.on('connection', (socket) => {
	console.log('Client', socket.id, 'is connected via WebSockets');

	chat.onConnection(socket);

	socket.on('message:new', ({ nickname, message }) => {
		io.sockets.emit('message:new', { nickname, message });
	});
});

app.get('/', function (req, res) {
	res.render('index', {
		title: 'Chat room'
	});
});

server.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
