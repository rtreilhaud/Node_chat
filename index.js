const http = require('http');
const express = require('express');
const app = express();
const port = 9000;
const server = http.Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.set('view engine', 'pug');

io.on('connection', (socket) => {
	console.log('Client', socket.id, 'is connected via WebSockets');
});

app.get('/', function (req, res) {
	const msg = [
		{ user: 'pseudo1', text: 'Message example' },
		{ user: 'pseudo2', text: 'Response example' },
		{ user: 'pseudo3', text: '...' }
	];
	res.render('index', {
		title: 'Chat room',
		messages: msg
	});
});

server.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
