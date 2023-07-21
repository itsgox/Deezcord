const { developmentMode } = require('./config.json');
const { Server } = require('socket.io');
const io = new Server(3005, {
	cors: {
		origin: developmentMode ? 'http://localhost:3000' : 'https://deezcord.xyz'
	}
});

io.on('connection', (socket) => {

	socket.on('join', () => {
		io.sockets.timeout(2000).emit('online-users', io.sockets.sockets.size);
	});

	socket.on('send-message', (msg) => {
		io.sockets.emit('new-message', msg);
		io.sockets.timeout(2000).emit('online-users', io.sockets.sockets.size);
	});

	socket.on('start-typing', (usr) => {
		io.sockets.emit('user-start-typing', usr);
		io.sockets.timeout(2000).emit('online-users', io.sockets.sockets.size);
	});

	socket.on('stop-typing', (usr) => {
		io.sockets.emit('user-stop-typing', usr);
		io.sockets.timeout(2000).emit('online-users', io.sockets.sockets.size);
	});
});

io.sockets.on('connection', (socket) => {
	io.sockets.emit('online-users', io.sockets.sockets.size);
	socket.on('disconnect', () => {
		io.sockets.emit('online-users', io.sockets.sockets.size);
	});
});