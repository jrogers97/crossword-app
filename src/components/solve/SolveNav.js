import React, {Component} from 'react';
import Timer from './Timer';
// import './styles/SolveNav.css';
import styled from 'styled-components';
import notesIcon from '../../icon/pencil.svg';
import checkIcon from '../../icon/check.svg';
import saveIcon from '../../icon/save.svg';

class SolveNav extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeDropdown: "",
			notesActive: this.props.notesActive
		};

		this.handleNavButtonClick = this.handleNavButtonClick.bind(this);
	}

	componentDidMount() {
		this.daysDropdown = document.querySelector("#days-dropdown");
		this.checkDropdown = document.querySelector("#check-dropdown");
		this.revealDropdown = document.querySelector("#reveal-dropdown");
		
		this.daysButton = document.querySelector("#days-button");
		this.checkButton = document.querySelector("#check-button");
		this.revealButton = document.querySelector("#reveal-button");
		this.notesButton = document.querySelector("#notes-button");

		this.setDropdownPositions();

		// close dropdown for outside clicks
		window.addEventListener("click", e => {
			const target = e.target.id;
			if (target !== "check-button" 
				&& target !== "reveal-button" 
				&& target !== "days-button"
				&& !e.target.className.includes("days-dropdown")) {
				this.setState({activeDropdown: ""});
			}
		});

		var resizeId;
		window.addEventListener('resize', () => {
			clearTimeout(resizeId);
			resizeId = setTimeout(this.setDropdownPositions.bind(this), 500);
		});
	}

	handleNavButtonClick(e) {
		const daysClicked = e.target.id === "days-button";
		const checkClicked = e.target.id === "check-button";
		const revealClicked = e.target.id === "reveal-button";
		const notesClicked = e.target.id === "notes-button" || e.target.id === "notes-icon" || e.target.id === "notes-text";

		let newActiveDropdown;
		if (daysClicked) {
			newActiveDropdown = this.state.activeDropdown === "days" ? "" : "days";
		} else if (checkClicked) {
			newActiveDropdown = this.state.activeDropdown === "check" ? "" : "check";
		} else if (revealClicked) {
			newActiveDropdown = this.state.activeDropdown === "reveal" ? "" : "reveal";
		}

		this.setState({
			activeDropdown: newActiveDropdown,
			notesActive: notesClicked ? !this.state.notesActive : this.state.notesActive
		});
	}

	setDropdownPositions() {
		const dropdownEls = [
			[this.daysDropdown, this.daysButton], 
			[this.checkDropdown, this.checkButton], 
			[this.revealDropdown, this.revealButton]
		];

		// position dropdown below its relevant button
		dropdownEls.forEach(([dropdown, button]) => {
			dropdown.style.top = `${button.offsetTop + button.offsetHeight + 1}px`;
			dropdown.style.left = `${button.offsetLeft}px`;
		});
	}

	render() {
		const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
		return (
			<React.Fragment>
				<NewPuzzleButton onClick={this.props.handleNewPuzzleClick}> New Puzzle </NewPuzzleButton>
				<DaysButton 
					id="days-button" 
					isActive={this.state.activeDropdown === "days"}
					onClick={this.handleNavButtonClick}> 
					Difficulty 
				</DaysButton>
				
				<RightButtons>
					<Timer 
						value={this.props.timerValue}
						finished={this.props.finished}
						correct={this.props.correct}
						hasStarted={this.props.hasStarted}
						loading={this.props.loaded}
						paused={this.props.paused} 
						handleTimerPause={this.props.handleTimerPause} />
						
					<StyledButton onClick={this.props.handleClearClick}> Clear Puzzle </StyledButton>
					<StyledButton 
						id="reveal-button"
						isActive={this.state.activeDropdown === "reveal"}
						onClick={this.handleNavButtonClick}> 
						Reveal 
					</StyledButton>
					<StyledButton 
						id="check-button"
						isActive={this.state.activeDropdown === "check"}
						onClick={this.handleNavButtonClick}> 
						Check 
					</StyledButton>
					<NotesButton 
						id="notes-button" 
						isActive={this.state.notesActive}
						onClick={(e) => {
							this.handleNavButtonClick(e);
							this.props.handleNotesClick(e);
						}}> 
						<NotesIcon src={notesIcon} alt="Notes" id="notes-icon" isActive={this.state.notesActive} />
						<NotesText id="notes-text" isActive={this.state.notesActive}> Notes </NotesText>
					</NotesButton>
					<SaveButton
						id="save-button" 
						saved={this.props.progressSaved}
						onClick={(e) => {
							this.props.handleSaveClick(e);
						}}> 
						<StyledButtonIcon src={this.props.progressSaved ? checkIcon : saveIcon} alt="Save Puzzle"/>
						<StyledButtonText> {this.props.progressSaved ? "Saved" : "Save"} </StyledButtonText>
					</SaveButton>
				</RightButtons>

				<DaysDropdown id="days-dropdown" isActive={this.state.activeDropdown === "days"}>
					{days.map(day => {
						return (
							<DaysDropdownItem htmlFor={day} key={day} className="days-dropdown-item">
								<input 
									className="days-dropdown-checkbox"
									type="checkbox" 
									id={day} 
									name={day} 
									onChange={this.props.onCheckboxChange}
									defaultChecked={true} />
								<DaysDropdownText className="days-dropdown-text"> 
									{day.charAt(0).toUpperCase() + day.slice(1)} 
								</DaysDropdownText>
							</DaysDropdownItem>
						);
					})}
				</DaysDropdown>

				<StyledDropdown id="reveal-dropdown" isActive={this.state.activeDropdown === "reveal"}>
					<StyledDropdownItem onClick={() => this.props.handleRevealClick(0)}> Square </StyledDropdownItem>
					<StyledDropdownItem onClick={() => this.props.handleRevealClick(1)}> Clue </StyledDropdownItem>
					<StyledDropdownItem onClick={() => this.props.handleRevealClick(2)}> Puzzle </StyledDropdownItem>
				</StyledDropdown>

				<StyledDropdown id="check-dropdown" isActive={this.state.activeDropdown === "check"}>
					<StyledDropdownItem onClick={() => this.props.handleCheckClick(0)}> Square </StyledDropdownItem>
					<StyledDropdownItem onClick={() => this.props.handleCheckClick(1)}> Clue </StyledDropdownItem>
					<StyledDropdownItem onClick={() => this.props.handleCheckClick(2)}> Puzzle </StyledDropdownItem>
				</StyledDropdown>
			</React.Fragment>
		);
	}
}

const StyledButton = styled(({isActive, ...rest}) => <button {...rest} />)`
	height: 100%;
	font-size: 14px;
	border: none;
	color: black;
	padding: 0 18px;
	background-color: ${props => props.isActive ? "rgba(0,0,0,0.1)" : "initial"};
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
	border: none;
	height: 100%;
	padding: 1px 13px;
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

const StyledDropdown = styled(({isActive, ...rest}) => <div {...rest} />)`
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