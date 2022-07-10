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
let connectPeersStrangers = [];

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
		} else {
			const data = {
				preOfferAnswer: 'CALLEE_NOT_FOUND',
			}
			io.to(socket.id).emit('pre-offer-answer', data);
		}
	})

	socket.on('pre-offer-answer', data => {
		console.log('pre offer answer came');
		console.log(data);
		const { callerSocketId } = data;
		const connectedPeer = connectPeers.find(peerSocketId => peerSocketId === callerSocketId);

		if (connectedPeer) {
			io.to(callerSocketId).emit('pre-offer-answer', data);
		}
	})

	socket.on('webRTC-signaling', data => {
		const { connectedUserSocketId } = data;
		const connectedPeer = connectPeers.find(peerSocketId => peerSocketId === connectedUserSocketId);

		if (connectedPeer) {
			io.to(connectedUserSocketId).emit('webRTC-signaling', data)
		}
	})

	socket.on('user-hanged-up', data => {
		const { connectedUserSocketId } = data;
		const connectedPeer = connectPeers.find(peerSocketId => peerSocketId === connectedUserSocketId);

		if (connectedPeer) {
			io.to(connectedUserSocketId).emit('user-hanged-up');
		}
	})

	socket.on('stranger-connection-status', data => {
		const { status } = data;

		if (status) {
			connectPeersStrangers.push(socket.id);
		} else {
			const newConnectedPeersStrangers = connectPeersStrangers.filter(peerSocketId => peerSocketId !== socket.id);
			connectPeersStrangers = newConnectedPeersStrangers;
		}

		console.log('connectPeersStrangers', connectPeersStrangers);
	})

	socket.on('get-stranger-socket-id', () => {
		let randomStrangerSocketId;
		const filterConnectedPeersStrangers = connectPeersStrangers.filter(peerSocketId => peerSocketId !== socket.id);

		if (filterConnectedPeersStrangers.length > 0) {
			randomStrangerSocketId = filterConnectedPeersStrangers[
				Math.floor(Math.random() * filterConnectedPeersStrangers.length)
			];
		} else {
			randomStrangerSocketId = null;
		}

		io.to(socket.id).emit('get-stranger-socket-id', {
			randomStrangerSocketId
		});
	})

	socket.on('disconnect', () => {
		const newConnectedPeers = connectPeers.filter((peerSocketId) => peerSocketId !== socket.id);
		connectPeers = newConnectedPeers;

		const newConnectedPeersStrangers = connectPeersStrangers.filter(peerSocketId => peerSocketId !== socket.id);
		connectPeersStrangers = newConnectedPeersStrangers;
	})
})

server.listen(PORT, () => {
	console.log(`webrtc application listening on http://localhost:${PORT}`);
})
