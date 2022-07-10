import * as ui from './ui.js';
import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';

export const changeStrangerConnectionStatus = status => {
	const data = { status };
	wss.changeStrangerConnectionStatus(data);
}

let strangerCallType;
export const getStrangerSocketIdAndConnect = callType => {
	strangerCallType = callType;
	wss.getStrangerSocketId();
}

export const connecWithStranger = data => {
	const { randomStrangerSocketId } = data;

	console.log(randomStrangerSocketId);
	if (randomStrangerSocketId) {
		webRTCHandler.sendPreOffer(strangerCallType, randomStrangerSocketId);
	} else {
		// no user is available for connection
		ui.showNoStrangerAvailableDialog();
	}
}
