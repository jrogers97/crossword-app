import React, {Component} from 'react';
import './styles/Nav.css';
import notesLogo from '../pencil.svg';

class Nav extends Component {
	constructor(props) {
		super(props);

		this.handleNavButtonClick = this.handleNavButtonClick.bind(this);
	}

	handleNavButtonClick(e) {
		console.log(e.target);
		// toggle dropdown of clicked button, hide all other dropdowns
		if (e.target.classList.value.includes("Days")) {
			this.daysDropdown.classList.toggle("hidden");
			this.checkDropdown.classList.add("hidden");
			this.revealDropdown.classList.add("hidden");

			this.daysButton.classList.toggle("active");
			this.checkButton.classList.remove("active");
			this.revealButton.classList.remove("active");

		} else if (e.target.classList.value.includes("Check")) {
			this.daysDropdown.classList.add("hidden");
			this.checkDropdown.classList.toggle("hidden");
			this.revealDropdown.classList.add("hidden");

			this.daysButton.classList.remove("active");
			this.checkButton.classList.toggle("active");
			this.revealButton.classList.remove("active");

		} else if (e.target.classList.value.includes("Reveal")) {
			this.daysDropdown.classList.add("hidden");
			this.checkDropdown.classList.add("hidden");
			this.revealDropdown.classList.toggle("hidden");

			this.daysButton.classList.remove("active");
			this.checkButton.classList.remove("active");
			this.revealButton.classList.toggle("active");
		}

		if (e.target.classList.value.includes("Notes")) {
			this.notesButton.classList.toggle("active-notes");
		}
	}

	componentDidMount() {
		this.daysDropdown = document.querySelector(".NavBar-DaysDropdown");
		this.checkDropdown = document.querySelector(".NavBar-CheckDropdown");
		this.revealDropdown = document.querySelector(".NavBar-RevealDropdown");
		
		this.daysButton = document.querySelector(".NavBar-Days");
		this.checkButton = document.querySelector(".NavBar-Check");
		this.revealButton = document.querySelector(".NavBar-Reveal");
		this.notesButton = document.querySelector(".NavBar-Notes");

		this.daysDropdown.style.top = `${this.daysButton.offsetTop + this.daysButton.offsetHeight + 1}px`;
		this.daysDropdown.style.left = `${this.daysButton.offsetLeft}px`;

		this.checkDropdown.style.top = `${this.checkButton.offsetTop + this.checkButton.offsetHeight + 1}px`;
		this.checkDropdown.style.left = `${this.checkButton.offsetLeft}px`;

		this.revealDropdown.style.top = `${this.revealButton.offsetTop + this.revealButton.offsetHeight + 1}px`;
		this.revealDropdown.style.left = `${this.revealButton.offsetLeft}px`;

		// close difficulty dropdown if click is outside it
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
	}

	render() {
		let days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
		return (
			<div className="NavBar">
				<button className="NavBar-NewPuzzle" onClick={this.props.handleNewPuzzleClick}> New Puzzle </button>
				<button className="NavBar-Days" onClick={this.handleNavButtonClick}> Difficulty </button>
				
				<div className="NavBar-RightButtons">
					<button className="NavBar-Clear" onClick={this.props.handleClearClick}> Clear Puzzle </button>
					<button className="NavBar-Reveal" onClick={this.handleNavButtonClick}> Reveal </button>
					<button className="NavBar-Check" onClick={this.handleNavButtonClick}> Check </button>
					<button className="NavBar-Notes" onClick={(e) => {
						this.handleNavButtonClick(e);
						this.props.handleNotesClick(e);
					}}> 
						<img src={notesLogo} alt="Notes" className="NavBar-NotesLogo"/>
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
					<button className="NavBar-RevealDropdownItem square" onClick={() => this.props.handleRevealClick(0)}> Square </button>
					<button className="NavBar-RevealDropdownItem clue" onClick={() => this.props.handleRevealClick(1)}> Clue </button>
					<button className="NavBar-RevealDropdownItem puzzle" onClick={() => this.props.handleRevealClick(2)}> Puzzle </button>
				</div>

				<div className="NavBar-CheckDropdown hidden">
					<button className="NavBar-CheckDropdownItem square" onClick={() => this.props.handleCheckClick(0)}> Square </button>
					<button className="NavBar-CheckDropdownItem clue" onClick={() => this.props.handleCheckClick(1)}> Clue </button>
					<button className="NavBar-CheckDropdownItem puzzle" onClick={() => this.props.handleCheckClick(2)}> Puzzle </button>
				</div>
			</div>
		);
	}
}

export default Nav;