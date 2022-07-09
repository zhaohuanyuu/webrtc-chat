import * as ui from './ui.js';
import * as wss from './wss.js';
import * as store from './store.js';
import * as constants from './constants.js';
import * as webRTCHandler from './webRTCHandler.js';

// initialization of socketIO connection
const socket = io('/');
wss.registerSocketEvents(socket);

webRTCHandler.getLocalPreview();

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

// event listeners for video call buttons
const micButton = document.getElementById('mic_button');
micButton.addEventListener('click', e => {
	const localStream = store.getState().localStream;
	const micEnabled = localStream.getAudioTracks()[0]['enabled'];

	localStream.getAudioTracks()[0]['enabled'] = !micEnabled;
	ui.updateMicButton(micEnabled);
})

const cameraButton = document.getElementById('camera_button');
cameraButton.addEventListener('click', () => {
	const localStream = store.getState().localStream;
	const cameraEnabled = localStream.getVideoTracks()[0]['enabled'];

	localStream.getVideoTracks()[0]['enabled'] = !cameraEnabled;
	ui.updateCameraButton(cameraEnabled);
})

const switchForScreenSharingButton = document.getElementById('screen_sharing_button');
switchForScreenSharingButton.addEventListener('click', () => {
	const screenSharingActive = store.getState().screenSharingActive;
	webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
})
