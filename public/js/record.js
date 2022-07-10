import * as store from './store.js';

let mediaRecorder;
const recordedChunks = [];

const vp9Codec = 'video/webm; codecs=vp=9';
const vp9Options = { mineTYpe: vp9Codec };

export const startRecording = () => {
	const remoteStream = store.getState().remoteStream;

	if (MediaRecorder.isTypeSupported(vp9Codec)) {
		mediaRecorder = new MediaRecorder(remoteStream, vp9Options);
	} else {
		mediaRecorder = new MediaRecorder(remoteStream);
	}

	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.start();
}

export const pauseRecording = () => {
	mediaRecorder.pause();
}

export const resumeRecording = () => {
	mediaRecorder.resume();
}

export const stopRecording = () => {
	mediaRecorder.stop();
}

const downloadRecordedVideo = () => {
	const blob = new Blob(recordedChunks, {
		type: 'video/webm'
	})

	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.style.display = 'none';
	a.download = 'recording.webm';
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);
}

const handleDataAvailable = e => {
	if (e.data.size > 0) {
		console.log(e.data);
		recordedChunks.push(e.data);
		downloadRecordedVideo();
	}
}
