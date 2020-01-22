import React, {Component} from 'react';
import Timer from './Timer';
import './styles/Nav.css';
import notesIcon from '../pencil.svg';

class Nav extends Component {
	constructor(props) {
		super(props);

		this.handleNavButtonClick = this.handleNavButtonClick.bind(this);
	}

	componentDidMount() {
		this.daysDropdown = document.querySelector(".NavBar-DaysDropdown");
		this.checkDropdown = document.querySelector(".NavBar-CheckDropdown");
		this.revealDropdown = document.querySelector(".NavBar-RevealDropdown");
		
		this.daysButton = document.querySelector(".NavBar-Days");
		this.checkButton = document.querySelector(".NavBar-Check");
		this.revealButton = document.querySelector(".NavBar-Reveal");
		this.notesButton = document.querySelector(".NavBar-Notes");

		this.setDropdownPositions();

		// close dropdown for outside clicks
		window.addEventListener("click", e => {
			if (!e.target.classList.value.toLowerCase().includes("day") 
				&& !this.daysDropdown.classList.value.includes("hidden")) {
				this.daysDropdown.classList.toggle("hidden");
				this.daysButton.classList.remove("active");
			} 

			if (!e.target.classList.value.includes("NavBar-Check ") 
				&& this.checkButton.classList.value.includes("active")) {
				this.checkButton.classList.remove("active");
				this.checkDropdown.classList.add("hidden");
			}

			if (!e.target.classList.value.includes("NavBar-Reveal ")
				&& this.revealButton.classList.value.includes("active")) {
				this.revealButton.classList.remove("active");
				this.revealDropdown.classList.add("hidden");
			}
		});

		var resizeId;
		window.addEventListener('resize', () => {
			clearTimeout(resizeId);
			resizeId = setTimeout(this.setDropdownPositions.bind(this), 500);
		});
	}

	handleNavButtonClick(e) {
		const daysClicked = e.target.classList.value.includes("Days");
		const checkClicked = e.target.classList.value.includes("Check");
		const revealClicked = e.target.classList.value.includes("Reveal");

		const navItems = [
			[daysClicked, this.daysDropdown, this.daysButton],
			[checkClicked, this.checkDropdown, this.checkButton],
			[revealClicked, this.revealDropdown, this.revealButton]
		];

		// toggle hidden/shown for clicked item dropdown/button, hide for all others
		navItems.forEach(([clicked, dropdown, button]) => {
			if (clicked) {
				dropdown.classList.toggle("hidden");
				button.classList.toggle("active");
			} else {
				dropdown.classList.add("hidden");
				button.classList.remove("active");
			}
		});

		if (e.target.classList.value.includes("Notes")) {
			this.notesButton.classList.toggle("active-notes");
		}
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
		const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
		return (
			<div className="NavBar">
				<button className="NavBar-NewPuzzle" onClick={this.props.handleNewPuzzleClick}> New Puzzle </button>
				<button className="NavBar-Days" onClick={this.handleNavButtonClick}> Difficulty </button>
				
				<div className="NavBar-RightButtons">
					<Timer 
						value={this.props.timerValue}
						finished={this.props.finished}
						correct={this.props.correct}
						hasStarted={this.props.hasStarted}
						loading={this.props.loaded}
						paused={this.props.paused} 
						handleTimerPause={this.props.handleTimerPause} 
						onPageUnload={this.props.onPageUnload} />
						
					<button className="NavBar-Clear" onClick={this.props.handleClearClick}> Clear Puzzle </button>
					<button className="NavBar-Reveal" onClick={this.handleNavButtonClick}> Reveal </button>
					<button className="NavBar-Check" onClick={this.handleNavButtonClick}> Check </button>
					<button className="NavBar-Notes" onClick={(e) => {
						this.handleNavButtonClick(e);
						this.props.handleNotesClick(e);
					}}> 
						<img src={notesIcon} alt="Notes" className="NavBar-NotesIcon"/>
					</button>
				</div>

				<div className="NavBar-DaysDropdown hidden">
					{days.map(day => {
						return (
							<label htmlFor={day} key={day} className="NavBar-Day">
								<input 
									className="NavBar-DayCheckbox"
									type="checkbox" 
									id={day} 
									name={day} 
									onChange={this.props.onCheckboxChange}
									defaultChecked={true} />
								<span className="NavBar-DayText">{ day.charAt(0).toUpperCase() + day.slice(1) }</span>
							</label>
						);
					})}
				</div>

				<div className="NavBar-RevealDropdown hidden">
					<button className="NavBar-RevealDropdownItem" onClick={() => this.props.handleRevealClick(0)}> Square </button>
					<button className="NavBar-RevealDropdownItem" onClick={() => this.props.handleRevealClick(1)}> Clue </button>
					<button className="NavBar-RevealDropdownItem" onClick={() => this.props.handleRevealClick(2)}> Puzzle </button>
				</div>

				<div className="NavBar-CheckDropdown hidden">
					<button className="NavBar-CheckDropdownItem" onClick={() => this.props.handleCheckClick(0)}> Square </button>
					<button className="NavBar-CheckDropdownItem" onClick={() => this.props.handleCheckClick(1)}> Clue </button>
					<button className="NavBar-CheckDropdownItem" onClick={() => this.props.handleCheckClick(2)}> Puzzle </button>
				</div>
			</div>
		);
	}
}

export default Nav;