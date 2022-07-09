import * as ui from './ui.js';
import * as wss from './wss.js';
import * as store from './store.js';
import * as constants from "./constants.js";
import {setScreenSharingActive, setScreenSharingStream} from "./store.js";

let connectedUserDetails = null;

const defaultConstrains = {
	audio: false,
	video: true
}
export const getLocalPreview = () => {
	navigator.mediaDevices.getUserMedia(defaultConstrains)
		.then(stream => {
			ui.updateLocalVideo(stream);
			store.setLocalStream(stream);
		})
		.catch(err => {
			console.log('error occured when trying to get an access to camera', err)
		})

}

let peerConnection;
const configuration = {
	iceServers: [
		{
			urls: "stun:stun.l.google.com:13902"
		}
	]
}
const createPeerConnection = () => {
	peerConnection = new RTCPeerConnection(configuration);

	peerConnection.onicecandidate = e => {
		console.log('greeting ice candidates from stun server');
		if (e.candidate) {
			// send our ice candidates to other peer
			wss.sendDataUsingWebRTCSignaling({
				candidate: e.candidate,
				type: constants.webRTCSignaling.ICE_CANDIDATE,
				connectedUserSocketId: connectedUserDetails.socketId
			})
		}
	}

	peerConnection.onconnectionstatechange = e => {
		if (peerConnection.connectionState === 'connected') {
			console.log('successfully connected with other peer');
		}
	}

	// receive tracks
	const remoteStream = new MediaStream();
	store.setRemoteStream(remoteStream);
	ui.updateRemoteVideo(remoteStream);

	peerConnection.ontrack = e => {
		remoteStream.addTrack(e.track);
	}

	// add our stream to peer connection
	if (connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE) {
		const localStream = store.getState().localStream;

		for (const track of localStream.getTracks()) {
			peerConnection.addTrack(track, localStream);
		}
	}
}

export const sendPreOffer = (callType, calleePersonalCode) => {
	connectedUserDetails = {
		callType,
		socketId: calleePersonalCode
	}

	if (
		callType === constants.callType.CHAT_PERSONAL_CODE
		|| callType === constants.callType.VIDEO_PERSONAL_CODE
	) {
		const data = {
			callType,
			calleePersonalCode
		}
		ui.showCallingDialog(callingDialogRejectCallHandler);
		wss.sendPreOffer(data);
	}
}

export const handlePreOffer = data => {
	// console.log('pre offer came', data);
	const { callType, callerSocketId } = data;

	connectedUserDetails = {
		socketId: callerSocketId,
		callType,
	};

	if (
		callType === constants.callType.CHAT_PERSONAL_CODE
		|| callType === constants.callType.VIDEO_PERSONAL_CODE
	) {
		ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
	}
}

export const handlePreOfferAnswer = data => {
	const { preOfferAnswer } = data;
	ui.removeAllDialogs();

	console.log('pre offer answer came', preOfferAnswer);

	if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
		// show dialog that callee has not been found
		ui.showInfoDialog(preOfferAnswer);
	} else if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
		// show dialog that callee is not able to connect
		ui.showInfoDialog(preOfferAnswer);
	} else if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
		// show dialog that call is rejected by the callee
		ui.showInfoDialog(preOfferAnswer);
	} else if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
		ui.showCallElements(connectedUserDetails.callType);
		createPeerConnection();
		// sen webRTC offer
		sendWebRTCOffer();
	}
}

export const handleWebRTCOffer = async data => {
	await peerConnection.setRemoteDescription(data.offer);
	const answer = await peerConnection.createAnswer();
	await peerConnection.setLocalDescription(answer);
	wss.sendDataUsingWebRTCSignaling({
		answer,
		type: constants.webRTCSignaling.ANSWER,
		connectedUserSocketId: connectedUserDetails.socketId
	});
}

export const handleWebRTCAnswer = async data => {
	await peerConnection.setRemoteDescription(data.answer);
}

export const handleWebRTCCandidate = async data => {
	console.log('handiling incoming webRTC candidates');
	try {
		await peerConnection.addIceCandidate(data.candidate);
	} catch (err) {
		console.error('error occured when trying to add received ice candidate', err);
	}
}

let screenSharingStream;
export const switchBetweenCameraAndScreenSharing = async setScreenSharingActive => {
	if (setScreenSharingActive) {
		const localStream = store.getState().localStream;
		const senders = peerConnection.getSenders();
		const sender = senders.find(sender => sender.track.kind === screenSharingStream.getVideoTracks()[0]['kind']);

		if (sender) {
			sender.replaceTrack(localStream.getVideoTracks()[0]);
		}

		// stop screen sharing stream

		store.getState().screenSharingStream.getTracks().forEach(track => track.stop());
		store.setScreenSharingActive(!setScreenSharingActive);
		ui.updateLocalVideo(localStream);
	} else {
		try {
			screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
				video: true
			});
			store.setScreenSharingStream(screenSharingStream);

			// replace track which sender is sending
			const senders = peerConnection.getSenders();
			const sender = senders.find(sender => sender.track.kind === screenSharingStream.getVideoTracks()[0]['kind']);

			if (sender) {
				sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
			}

			store.setScreenSharingActive(!setScreenSharingActive);

			ui.updateLocalVideo(screenSharingStream);
		} catch (err) {
			console.error('error occur when trying to get screen sharing stream ', err)
		}
	}
}

// WebRTC helper
const sendWebRTCOffer = async () => {
	const offer = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(offer);
	wss.sendDataUsingWebRTCSignaling({
		offer,
		type: constants.webRTCSignaling.OFFER,
		connectedUserSocketId: connectedUserDetails.socketId
	})
}

const acceptCallHandler = () => {
	console.log('acceptCallHandler');
	createPeerConnection();
	sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
	ui.showCallElements(connectedUserDetails.callType)
}

const rejectCallHandler = () => {
	console.log('rejectCallHandler')
	sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const callingDialogRejectCallHandler = () => {
	console.log('rejecting the call');
	sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const sendPreOfferAnswer = (preOfferAnswer) => {
	const data = {
		preOfferAnswer,
		callerSocketId: connectedUserDetails.socketId
	}
	ui.removeAllDialogs();
	wss.sendPreOfferAnswer(data);
}
