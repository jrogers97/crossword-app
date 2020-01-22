import React from 'react';
import {formatTime} from '../util/utilities';
import './styles/Modal.css';

const getModalText = (hasStarted, paused, timerValue, finished, correct) => {
	if (!hasStarted) {
		return "Ready to start solving?";
	} else if (paused && !finished) {
		return `Your game is paused at ${formatTime(timerValue)}`;
	} else if (finished) {
		if (!correct) {
			return "Almost there! One or more squares are incorrect.";
		} else {
			return `You finished in ${formatTime(timerValue)}!`;
		}
	} 
}

const getModalButtonText = (paused, finished, correct) => {
	if (paused && !finished) {
		return "RESUME";
	} else if (finished && !correct) {
		return "KEEP TRYING";
	} else {
		return "OK";
	}
}

const Modal = ({hasStarted, loading, paused, timerValue, finished, correct, handleModalButtonClick}) => {
	return (
		<div className={"ModalOverlay " + ((!paused && hasStarted) || loading ? "hidden" : "")}>
			<div className="ModalContent">
				<p className="ModalText"> 
					{getModalText(hasStarted, paused, timerValue, finished, correct)}
				</p>
				<button className="ModalButton" onClick={handleModalButtonClick}>
					{getModalButtonText(paused, finished, correct)}
				</button>
			</div>
		</div>
	);
}

export default Modal;