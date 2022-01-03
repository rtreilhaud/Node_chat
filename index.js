const express = require('express');
const app = express();
const port = 9000;

app.use(express.static('public'));

app.set('view engine', 'pug');

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

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
