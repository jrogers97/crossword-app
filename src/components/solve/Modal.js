import React from 'react';
import {formatTime} from '../../util/utilities';
import styled from 'styled-components';
// import './styles/Modal.css';

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
		<ModalOverlay hidden={(!paused && hasStarted) || loading}>
			<ModalContent>
				<ModalText> 
					{getModalText(hasStarted, paused, timerValue, finished, correct)}
				</ModalText>
				<ModalButton onClick={handleModalButtonClick}>
					{getModalButtonText(paused, finished, correct)}
				</ModalButton>
			</ModalContent>
		</ModalOverlay>
	);
}

const ModalOverlay = styled.div`
	position: absolute;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	z-index: 1;
	top: 0;
	left: 0;
	background-color: rgba(255,255,255,0.5);
	display: ${props => props.hidden ? "none" : "block"};
`;

const ModalContent = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -150px;
	margin-left: -200px;
	height: 300px;
	width: 400px;
	background-color: white;
	box-shadow: 0px 2px 4px 0 rgba(0,0,0,0.5);
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 5px;
`;

const ModalText = styled.p`
	text-align: center;
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 20px;
	padding: 0 30px;
	line-height: 28px;
`;

const ModalButton = styled.button`
	min-width: 120px;
	border: none;
	background-color: #4F85E5;
	color: white;
	border-radius: 20px;
	line-height: 20px;
	font-size: 16px;
	font-weight: bold;
	box-shadow: 0 2px 2px 0 rgba(0,0,0,0.8);
	padding: 10px 15px;
	&:hover {
		cursor: pointer;
    	box-shadow: 0 2px 4px 0 rgba(0,0,0,1);
	}
	&:active {
		outline: none;
	}
`;

export default Modal;