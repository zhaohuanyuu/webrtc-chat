import * as store from './store.js';
import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';

// initialization of socketIO connection
const socket = io('/');
wss.registerSocketEvents(socket);

// register event listener for personal code copy button
const personalCodeCopyButton = document.getElementById('personal_code_copy_button');
personalCodeCopyButton.addEventListener('click', e => {
	const { socketId } = store.getState();
	navigator.clipboard && navigator.clipboard.writeText(socketId);
})

// register event listeners for connection buttons
const personalCodeCharButton = document.getElementById('personal_code_chat_button');
personalCodeCharButton.addEventListener('click', e => {
	const calleePersonalCode = document.getElementById('personal_code_input');
	const callType = constants.callType.CHAT_PERSONAL_CODE;
	webRTCHandler.sendPreOffer(callType, calleePersonalCode.value);
})

const personalCodeVideoButton = document.getElementById('personal_code_video_button');
personalCodeVideoButton.addEventListener('click', e => {
	const calleePersonalCode = document.getElementById('personal_code_input');
	const callType = constants.callType.VIDEO_PERSONAL_CODE;
	webRTCHandler.sendPreOffer(callType, calleePersonalCode.value);
})
