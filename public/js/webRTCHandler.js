import * as ui from './ui.js';
import * as wss from './wss.js';
import * as constants from "./constants.js";

let connectedUserDetails = null;

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
		ui.showCallingDialog(callingDialogRejectCallHander);
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

const acceptCallHandler = () => {
	console.log('acceptCallHandler')
}
const rejectCallHandler = () => {
	console.log('rejectCallHandler')
}

const callingDialogRejectCallHander = () => {
	console.log('rejecting the call');
}
