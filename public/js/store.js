let state = {
	socketId: null,
	localStream: null,
	remoteStream: null,
	screenSharingStream: null,
	allowConnectionsFromStrangers: false,
	screenSharingActive: false,
};

export const setSocketId = socketId => {
	state = {
		...state,
		socketId
	}
	// console.log('setSocketId > ', state);
}

export const setLocalStream= stream => {
	state = {
		...state,
		localStream: stream
	}
}

export const setRemoteStream = stream => {
	state = {
		...state,
		remoteStream: stream
	}
}

export const setAllowConnectionFromStrangers = aloowConnection => {
	state = {
		...state,
		allowConnectionsFromStrangers: aloowConnection
	}
}

export const setScreenSharingActive = screenSharingActive => {
	state = {
		...state,
		screenSharingActive
	}
}

export const setScreenSharingStream = stream => {
	state = {
		...state,
		screenSharingStream: stream
	}
}

export const getState = () => {
	return state;
}
