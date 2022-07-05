const express = require('express');
const http = require('http');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
})

let connectPeers = [];

io.on('connection', socket => {
	// console.log('user connected to socket.io server');
	// console.log(socket.id);

	connectPeers.push(socket.id);
	console.log(connectPeers);

	socket.on('pre-offer', data => {
		const { callType, calleePersonalCode } = data;
		const connectedPeer = connectPeers.find(peerSocketId => peerSocketId === calleePersonalCode);

		if (connectedPeer) {
			const data = {
				callerSocketId: socket.id,
				callType,
			}

			io.to(calleePersonalCode).emit('pre-offer', data);
		}
	})

	socket.on('disconnect', () => {
		const newConnectedPeers = connectPeers.filter((peerSocketId) => peerSocketId !== socket.id);
		connectPeers = newConnectedPeers;
	})
})

server.listen(PORT, () => {
	console.log(`webrtc application listening on http://localhost:${PORT}`);
})
