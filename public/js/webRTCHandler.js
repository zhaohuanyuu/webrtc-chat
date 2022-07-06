import * as ui from './ui.js';
import * as wss from './wss.js';
import * as constants from "./constants.js";

let connectedUserDetails = null;

export const sendPreOffer = (callType, calleePersonalCode) => {
	const data = {
	  callType,
		calleePersonalCode
	}
	wss.sendPreOffer(data);
}

export const handlePreOffer = data => {
	// console.log('pre offer came', data);
	const { callType, callerSocketId } = data;

	connectedUserDetails = {
		socketId: callerSocketId,
		callType,
	};

	const acceptCallHandler = () => {
		console.log('acceptCallHandler')
	}
	const rejectCallHandler = () => {
		console.log('rejectCallHandler')
	}

	if (
		callType === constants.callType.CHAT_PERSONAL_CODE
		|| callType === constants.callType.VIDEO_PERSONAL_CODE
	) {
		ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
	}
}
