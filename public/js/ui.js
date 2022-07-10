import * as constants from "./constants.js";
import * as elements from './elements.js';

export const updatePersonalCode = (personalCode) => {
	const personalCodeParagraph = document.getElementById(
		"personal_code_paragraph"
	);
	personalCodeParagraph.innerHTML = personalCode;
};

export const updateLocalVideo = stream => {
	const localVideo = document.getElementById('local_video');

	localVideo.srcObject = stream;
	localVideo.addEventListener('loadedmetadata', () => {
		localVideo.play();
	})
}

export const updateRemoteVideo = stream => {
	const remoteVideo = document.getElementById('remote_video');

	remoteVideo.srcObject = stream;
	// remoteVideo.addEventListener('loadedmetadata', () => {
	// 	remoteVideo.play();
	// })
}

export const showIncomingCallDialog = (callType, acceptCallHandler, rejectCallHandler) => {
	const callTypeInfo = callType === constants.callType.CHAT_PERSONAL_CODE ? 'Chat' : "Video";
	const incomingDialog = elements.getIncomingDialog(callType, acceptCallHandler, rejectCallHandler);

	const dialog = document.getElementById('dialog');
	dialog.querySelectorAll('*').forEach(dialog => dialog.remove());
	dialog.appendChild(incomingDialog);
}

export const showCallingDialog = rejectCallHandler => {
	const callingDialog = elements.getCallingDialog(rejectCallHandler);

	const dialog = document.getElementById('dialog');
	dialog.querySelectorAll('*').forEach(dialog => dialog.remove());
	dialog.appendChild(callingDialog);
}

export const showNoStrangerAvailableDialog = () => {
	const infoDialog = elements.getInfoDialog('No Stranger available', 'Please try later again');

	if (infoDialog) {
		const dialog = document.getElementById('dialog');
		dialog.appendChild(infoDialog)

		setTimeout(() => {
			removeAllDialogs();
		}, 3500)
	}
}

export const showInfoDialog = preOfferAnswer => {
	let infoDialog = null;

	if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
		infoDialog = elements.getInfoDialog(
			'Call rejected',
			'Callee rejected your call'
		)
	} else if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
		infoDialog = elements.getInfoDialog(
			'Callee not found',
			'Please check personal code'
		)
	} else if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
		infoDialog = elements.getInfoDialog(
			'Call is not possible',
			'Probably callee is busy. Please try again later '
		)
	}

	if (infoDialog) {
		const dialog = document.getElementById('dialog');
		dialog.appendChild(infoDialog)

		setTimeout(() => {
			removeAllDialogs();
		}, 3500)
	}
}

export const removeAllDialogs = () => {
	const dialog = document.getElementById('dialog');
	dialog.querySelectorAll('*').forEach(dialog => dialog.remove());
}


export const showCallElements = callType => {
	if (
		callType === constants.callType.CHAT_PERSONAL_CODE
		|| callType === constants.callType.CHAT_STRANGER
	) {
		showChatCallElements();
	} else if (
		callType === constants.callType.VIDEO_PERSONAL_CODE
		|| callType === constants.callType.VIDEO_STRANGER
	) {
		showVideoCallElements();
	}
}

// ui call buttons
const micOnImgSrc = './images/mic.png';
const micOffImgSrc = './images/micOff .png';
export const updateMicButton = micActive => {
	const micButtonImage = document.getElementById('mic_button_image');
	micButtonImage.src = micActive ? micOffImgSrc : micOnImgSrc;
}

const cameraOnImgSrc = './images/camera.png';
const cameraOffImgSrc = './images/cameraOff.png';
export const updateCameraButton = cameraActive => {
	const cameraButtonImage = document.getElementById('camera_button_image');
	cameraButtonImage.src = cameraActive ? cameraOffImgSrc : cameraOnImgSrc;
}

export const showVideoButtons = () => {
	const personalCodeVideoButton = document.getElementById('personal_code_video_button');
	const strangerVideoButton = document.getElementById('stranger_video_button');

	showElement(personalCodeVideoButton);
	showElement(strangerVideoButton);
}

// ui messages
export const appendMessage = (message, right = false) => {
	const messagesContainer = document.getElementById('messages_container');
	const messageElement = right ? elements.getRightMessage(message) : elements.getLeftMessage(message);

	messagesContainer.appendChild(messageElement);
}

export const clearMessager = () => {
	const messagesContainer = document.getElementById('messages_container');
	const allMessages = messagesContainer.querySelectorAll('*');

	if (allMessages && allMessages.length > 0) {
		allMessages.forEach(ele => ele.remove());
	}
}

// recording
export const showRecordingPannel = () => {
	const recordingButtons = document.getElementById('video_recording_buttons');
	showElement(recordingButtons);

	// hide start recording button if it is active
	const startRecordingButton = document.getElementById('start_recording_button');
	hideElement(startRecordingButton);
}

export const resetRecordingButton = () => {
	const startRecordingButton = document.getElementById('start_recording_button');
	const recordingButtons = document.getElementById('video_recording_buttons');

	hideElement(recordingButtons);
	showElement(startRecordingButton);
}

export const switchRecordingButtons = (switchForResumeButton = false) => {
	const resumeButton = document.getElementById('resume_recording_button');
	const pauseButton = document.getElementById('pause_recording_button');

	if (switchForResumeButton) {
		hideElement(pauseButton);
		showElement(resumeButton)
	} else {
		hideElement(resumeButton);
		showElement(pauseButton);
	}
}

// ui after hang up
export const updateUIAfterHangUp = callType => {
	enableDashboard();

	// hide the call call buttons
	if (
		callType === constants.callType.VIDEO_PERSONAL_CODE
		|| callType === constants.callType.VIDEO_STRANGER
	) {
		const callButtons = document.getElementById('call_buttons');
		hideElement(callButtons);
	} else {
		const chatCallButtons = document.getElementById('finish_chat_button_container');
		hideElement(chatCallButtons);
	}

	const newMessageInput = document.getElementById('new_message');
	hideElement(newMessageInput);
	clearMessager();

	updateMicButton(false);
	updateCameraButton(false);

	// hide remote video and show placeholder
	const placeholder = document.getElementById('video_placeholder');
	showElement(placeholder);

	const remoteVideo = document.getElementById('remote_video');
	hideElement(remoteVideo);

	removeAllDialogs();
}

// changing status of checkbox
export const updateStrangerCheckbox = allowConnections => {
	const checkboxCheckImg = document.getElementById('allow_strangers_checkbox_image');
	allowConnections ? showElement(checkboxCheckImg) : hideElement(checkboxCheckImg);
}

// ui helper functions
const showChatCallElements = () => {
	const finishConnectionChatButtonContainer = document.getElementById('finish_chat_button_container');

	showElement(finishConnectionChatButtonContainer);

	const newMessageInput = document.getElementById('new_message');
	showElement(newMessageInput);

	// block panel
	disableDashboard();
}

const showVideoCallElements = () => {
	const callButtons = document.getElementById('call_buttons');
	showElement(callButtons);

	const placeholder = document.getElementById('video_placeholder');
	hideElement(placeholder);

	const remoteVideo = document.getElementById('remote_video');
	showElement(remoteVideo);

	const newMessageInput = document.getElementById('new_message');
	showElement(newMessageInput);

	// block panel
	disableDashboard();
}

const enableDashboard = () => {
	const dashboardBlocker = document.getElementById('dashboard_blur');

	if (!dashboardBlocker.classList.contains('display_none')) {
		dashboardBlocker.classList.add('display_none')
	}
}

const disableDashboard = () => {
	const dashboardBlocker = document.getElementById('dashboard_blur');

	if (dashboardBlocker.classList.contains('display_none')) {
		dashboardBlocker.classList.remove('display_none')
	}
}

const hideElement = (element) => {
	if (!element.classList.contains('display_none')) {
		element.classList.add('display_none');
	}
}

const showElement = element => {
	if (element.classList.contains('display_none')) {
		element.classList.remove('display_none');
	}
}
