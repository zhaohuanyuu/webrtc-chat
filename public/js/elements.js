export const getIncomingDialog = (callTypeInfo, acceptCallHandler, rejectCallHandler) => {
	console.log('getting incoming call dialog');
	const dialog = document.createElement('div');
	dialog.classList.add('dialog_wrapper');

	const dialogContent = document.createElement('div');
	dialogContent.classList.add('dialog_content');

	dialog.appendChild(dialogContent);

	const title = document.createElement('p');
	title.classList.add('dialog_title');
	title.innerHTML = `Incoming ${callTypeInfo} Call`;

	const imageContainer = document.createElement('div');
	imageContainer.classList.add('dialog_image_container');

	const image = document.createElement('img');
	image.src = './images/dialogAvatar.png';
	imageContainer.appendChild(image);

	const buttonContainer = document.createElement('div');
	buttonContainer.classList.add('dialog_button_container');

	const acceptCallButton = document.createElement("button");
	acceptCallButton.classList.add("dialog_accept_call_button");
	const acceptCallImg = document.createElement("img");
	acceptCallImg.classList.add("dialog_button_image");
	acceptCallImg.src = "./images/acceptCall.png";
	acceptCallButton.append(acceptCallImg);
	buttonContainer.appendChild(acceptCallButton);

	const rejectCallButton = document.createElement("button");
	rejectCallButton.classList.add("dialog_reject_call_button");
	const rejectCallImg = document.createElement("img");
	rejectCallImg.classList.add("dialog_button_image");
	rejectCallImg.src = "./images/rejectCall.png";
	rejectCallButton.append(rejectCallImg);
	buttonContainer.appendChild(rejectCallButton);

	dialogContent.appendChild(title);
	dialogContent.appendChild(imageContainer);
	dialogContent.appendChild(buttonContainer);

	return dialog;
}
