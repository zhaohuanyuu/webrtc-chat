import * as ui from './ui.js';
import * as store from './store.js';
import * as constants from './constants.js'
import * as webRTCHandler from './webRTCHandler.js';

let socketIO = null;

export const registerSocketEvents = socket => {
	socketIO = socket;

	socket.on('connect', () => {
		console.log('successfully connect to socket.io server');
		store.setSocketId(socket.id);
		ui.updatePersonalCode(socket.id);
	})

	socket.on('pre-offer', data => {
		webRTCHandler.handlePreOffer(data);
	})

	socket.on('pre-offer-answer', data => {
		webRTCHandler.handlePreOfferAnswer(data);
	})

	socket.on('webRTC-signaling', data => {
		switch(data.type) {
			case constants.webRTCSignaling.OFFER:
				webRTCHandler.handleWebRTCOffer(data);
				break;
			case constants.webRTCSignaling.ANSWER:
				webRTCHandler.handleWebRTCAnswer(data);
				break;
			case constants.webRTCSignaling.ICE_CANDIDATE:
				webRTCHandler.handleWebRTCCandidate(data);
				break;
			default:
				return null;
		}
	})
}

export const sendPreOffer = data => {
	socketIO.emit('pre-offer', data);
}

export const sendPreOfferAnswer = data => {
	socketIO.emit('pre-offer-answer', data);
}

export const sendDataUsingWebRTCSignaling = data => {
	socketIO.emit('webRTC-signaling', data);
}
