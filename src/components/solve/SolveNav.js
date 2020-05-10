import React, {useState, useEffect, useRef} from 'react';
import Timer from './Timer';
import styled from 'styled-components';
import notesIcon from '../../icon/pencil.svg';
import checkIcon from '../../icon/check.svg';
import saveIcon from '../../icon/save.svg';

const SolveNav = ({
	handleTimerPause,
	handleTimerUpdate,
	handleNewPuzzleClick,
	handleCheckClick,
	handleRevealClick,
	handleClearClick,
	handleNotesClick,
	handleSaveClick,
	notesMode,
	onCheckboxChange,
	progressSaved,
	timerValue,
	hasStarted,
	paused,
	finished,
	correct
}) => {
	const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
	const [activeDropdown, setActiveDropdown] = useState("");
	const [notesActive, setNotesActive] = useState(notesMode);
	let resizeId;

	const daysDropdown = useRef(null);
	const checkDropdown = useRef(null);
	const revealDropdown = useRef(null);
	
	const daysButton = useRef(null);
	const checkButton = useRef(null);
	const revealButton = useRef(null);
	const notesButton = useRef(null);

	const closeDropdowns = (e) => {
		const target = e.target.id;
		if (target !== "check-button"
			&& target !== "reveal-button" 
			&& target !== "days-button"
			&& !e.target.className.includes("days-dropdown")) {
			setActiveDropdown("");
		}
	};

	const handleResize = () => {
		clearTimeout(resizeId);
		resizeId = setTimeout(setDropdownPositions, 500);
	};

	const handleNavButtonClick = (e) => {
		const daysClicked = e.target.id === "days-button";
		const checkClicked = e.target.id === "check-button";
		const revealClicked = e.target.id === "reveal-button";
		const notesClicked = e.target.id === "notes-button" || e.target.id === "notes-icon" || e.target.id === "notes-text";

		let newActiveDropdown;
		if (daysClicked) {
			newActiveDropdown = activeDropdown === "days" ? "" : "days";
		} else if (checkClicked) {
			newActiveDropdown = activeDropdown === "check" ? "" : "check";
		} else if (revealClicked) {
			newActiveDropdown = activeDropdown === "reveal" ? "" : "reveal";
		}

		setActiveDropdown(newActiveDropdown);
		setNotesActive(notesClicked ? !notesActive : notesActive);
	};

	const setDropdownPositions = () => {
		const dropdownEls = [
			[daysDropdown.current, daysButton.current], 
			[checkDropdown.current, checkButton.current], 
			[revealDropdown.current, revealButton.current]
		];

		// position dropdown below its relevant button
		dropdownEls.forEach(([dropdown, button]) => {
			dropdown.style.top = `${button.offsetTop + button.offsetHeight + 1}px`;
			dropdown.style.left = `${button.offsetLeft}px`;
		});
	};

	useEffect(() => {
		window.addEventListener("click", closeDropdowns);
		window.addEventListener("resize", handleResize);

		setDropdownPositions();

        // clean up
        return () => {
			window.removeEventListener("click", closeDropdowns);
			window.removeEventListener("resize", handleResize);
		}
	}, []);

	return (
		<React.Fragment>
			<NewPuzzleButton onClick={handleNewPuzzleClick}> New Puzzle </NewPuzzleButton>
			<DaysButton 
				id="days-button" 
				isActive={activeDropdown === "days"}
				onClick={handleNavButtonClick}
				ref={daysButton}> 
				Difficulty 
			</DaysButton>
			
			<RightButtons>
				<Timer 
					value={timerValue}
					correct={correct}
					hasStarted={hasStarted}
					paused={paused} 
					finished={finished}
					handleTimerPause={handleTimerPause}
					handleTimerUpdate={handleTimerUpdate} />
					
				<StyledButton onClick={handleClearClick}> Clear Puzzle </StyledButton>
				<StyledButton 
					id="reveal-button"
					isActive={activeDropdown === "reveal"}
					onClick={handleNavButtonClick}
					ref={revealButton}> 
					Reveal 
				</StyledButton>
				<StyledButton 
					id="check-button"
					isActive={activeDropdown === "check"}
					onClick={handleNavButtonClick}
					ref={checkButton}> 
					Check 
				</StyledButton>
				<NotesButton 
					id="notes-button" 
					isActive={notesActive}
					ref={notesButton}
					onClick={(e) => {
						handleNavButtonClick(e);
						handleNotesClick(e);
					}}> 
					<NotesIcon src={notesIcon} alt="Notes" id="notes-icon" isActive={notesActive} />
					<NotesText id="notes-text" isActive={notesActive}> Notes </NotesText>
				</NotesButton>
				<SaveButton
					id="save-button" 
					saved={progressSaved}
					onClick={(e) => {
						handleSaveClick(e);
					}}> 
					<StyledButtonIcon src={progressSaved ? checkIcon : saveIcon} alt="Save Puzzle"/>
					<StyledButtonText> {progressSaved ? "Saved" : "Save"} </StyledButtonText>
				</SaveButton>
			</RightButtons>

			<DaysDropdown id="days-dropdown" isActive={activeDropdown === "days"} ref={daysDropdown}>
				{days.map(day => {
					return (
						<DaysDropdownItem htmlFor={day} key={day} className="days-dropdown-item">
							<input 
								className="days-dropdown-checkbox"
								type="checkbox" 
								id={day} 
								name={day} 
								onChange={onCheckboxChange}
								defaultChecked={true} />
							<DaysDropdownText className="days-dropdown-text"> 
								{day.charAt(0).toUpperCase() + day.slice(1)} 
							</DaysDropdownText>
						</DaysDropdownItem>
					);
				})}
			</DaysDropdown>

			<StyledDropdown id="reveal-dropdown" isActive={activeDropdown === "reveal"} ref={revealDropdown}>
				<StyledDropdownItem onClick={() => handleRevealClick(0)}> Square </StyledDropdownItem>
				<StyledDropdownItem onClick={() => handleRevealClick(1)}> Clue </StyledDropdownItem>
				<StyledDropdownItem onClick={() => handleRevealClick(2)}> Puzzle </StyledDropdownItem>
			</StyledDropdown>

			<StyledDropdown id="check-dropdown" isActive={activeDropdown === "check"} ref={checkDropdown}>
				<StyledDropdownItem onClick={() => handleCheckClick(0)}> Square </StyledDropdownItem>
				<StyledDropdownItem onClick={() => handleCheckClick(1)}> Clue </StyledDropdownItem>
				<StyledDropdownItem onClick={() => handleCheckClick(2)}> Puzzle </StyledDropdownItem>
			</StyledDropdown>
		</React.Fragment>
	);
};

const StyledButton = styled.button`
	height: 100%;
	font-size: 14px;
	border: none;
	color: black;
	padding: 0 18px;
	background-color: ${props => props.isActive ? "rgba(0,0,0,0.1)" : "transparent"};
	&:hover {
		cursor: pointer;
		background-color: rgba(0,0,0,0.1);
	}
	&:focus {
		outline: none;
	}
	@media (max-width: 700px) {
		font-size: 13px;
		padding: 0 12px;
	}
`;

const StyledButtonSecondary = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 51px;
	border: none;
	height: 100%;
	padding: 1px 13px;
	background-color: transparent;
	&:hover {
		cursor: pointer;
	}
	&:focus {
		outline: none;
	}
`;

const StyledButtonIcon = styled.img`
	height: 18px;
	width: 18px;
	vertical-align: middle;
	margin-bottom: 2px;
`;

const StyledButtonText = styled.p`
	text-align: center;
`;

const StyledDropdown = styled.div`
	position: fixed;
	flex-direction: column;
	background-color: white;
	z-index: 1;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	display: ${props => props.isActive? "flex" : "none"};
`;

const StyledDropdownItem = styled.div`
	height: 100%;
	font-size: 14px;
	border: none;
	background-color: inherit;;
	color: black;
	padding: 11px 15px;
	&:not(:last-child) {
		border-bottom: 1px solid rgba(0,0,0,0.2);
	}
	&:hover {
		cursor: pointer;
		background-color: rgba(0,0,0,0.1);
	}
`;

const NewPuzzleButton = styled(StyledButton)`
	height: auto;
	width: auto;
	background-color: white;
	box-shadow: 0 0 2px 0 rgba(0,0,0,0.5);
	border-radius: 4px;
	transition: all 200ms ease-in-out;
	white-space: nowrap;
	&:hover {
		box-shadow: 0 1px 5px 0 rgba(0,0,0,0.5);
		transition: all 200ms ease-in-out;
		background-color: white;
	}
	&:active {
		cursor: pointer;
		box-shadow: 0 0 2px 0 rgba(0,0,0,0.5);
		transition: all 100ms ease-in-out;
	}
	@media (max-width: 700px)
		margin-left: 12px;
		margin-right: 12px;
		padding: 6px!important;
`;

const DaysButton = styled(StyledButton)`
	padding: 0 10px;
	width: auto;
`;

const RightButtons = styled.div`
	margin: 0 10px 0 auto;
	height: 100%;
	display: flex;
`;

const NotesButton = styled(StyledButtonSecondary)`
	background-color: ${props => props.isActive ? "#4F85E5" : "transparent"};
	margin-left: 10px;
`;

const NotesIcon = styled(StyledButtonIcon)`
	filter: ${props => props.isActive ? "invert(1)" : "none"};
`;

const NotesText = styled(StyledButtonText)`
	color: ${props => props.isActive ? "white" : "initial"};
`;

const SaveButton = styled(StyledButtonSecondary)`
	&:hover {
		cursor: ${props => props.saved ? "auto" : "pointer"};
	}
`;

const DaysDropdown = styled(StyledDropdown)`
	padding: 10px;
`;

const DaysDropdownItem = styled.label`
	padding: 10px 15px 10px 10px;
	display: flex;
	align-items: center;
	&:hover {
		cursor: pointer;
	}
	&:not(:last-child) {
		border-bottom: 1px solid rgb(200,200,200);
	}
`;

const DaysDropdownText = styled.span`
	margin-left: 5px;
`;

export default SolveNav;