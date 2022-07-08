import * as ui from './ui.js';
import * as wss from './wss.js';
import * as constants from "./constants.js";
import {removeAllDialogs} from "./ui.js";

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

export const handlePreOfferAnswer = data => {
	const { preOfferAnswer } = data;
	ui.removeAllDialogs();

	console.log('pre offer answer came', preOfferAnswer);

	if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
		// show dialog that callee has not been found
	} else if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
		// show dialog that callee is not able to connect
	} else if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
		// show dialog that call is rejected by the callee
	} else if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
		// sen webRTC offer
	}
}

const acceptCallHandler = () => {
	console.log('acceptCallHandler');
	sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
}
const rejectCallHandler = () => {
	console.log('rejectCallHandler')
	sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const callingDialogRejectCallHander = () => {
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
