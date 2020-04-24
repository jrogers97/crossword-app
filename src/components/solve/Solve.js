import React, { Component, Fragment } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import ClipLoader from 'react-spinners/ClipLoader';
// import './styles/Solve.css';
import styled from 'styled-components';
import { fetchRandomData, makeFinishedGrid, makeClues } from '../../util/data';
import * as utils from '../../util/utilities';

import { NavWrapper } from '../common/NavWrapper';
import Grid from './Grid';
import Clues from './Clues';
import ClueBanner from './ClueBanner';
import PuzzleHeader from './PuzzleHeader';
import Modal from './Modal';


class Solve extends Component {
	constructor(props) {
		super(props);

		this.state = {
			finishedGrid: [],
			grid: [],
			clues: {},
			rowLength: 15,
			activeClue: null,
			altDirectionActiveClue: null,
			activeCell: null,
			activeClueCells: null,
			incorrectCells: [],
			correctCells: [],
			revealedCells: [],
			noteCells: [],
			greyedClues: [],
			puzzleDate: null,
			puzzleAuthor: null,
			isAcross: true,
			notesMode: false,
			progressSaved: false,
			ignoredDays: [],
			labels: [],
			loading: true,
			paused: false,
			timerValue: 0,
			hasStarted: false,
			shouldCheckFinishedGrid: true,
			finished: false,
			correct: false
		}

		this.handleCellClick        = this.handleCellClick.bind(this);
		this.handleClueClick        = this.handleClueClick.bind(this);
		this.handleKeyDown          = this.handleKeyDown.bind(this);
		this.handleNewPuzzleClick   = this.handleNewPuzzleClick.bind(this);
		this.handleCheckClick       = this.handleCheckClick.bind(this);
		this.handleRevealClick      = this.handleRevealClick.bind(this);
		this.handleClearClick       = this.handleClearClick.bind(this);
		this.handleTimerPause	    = this.handleTimerPause.bind(this);
		this.handleTimerUpdate	    = this.handleTimerUpdate.bind(this);
		this.handleCheckboxChange   = this.handleCheckboxChange.bind(this);
		this.handleNotesClick       = this.handleNotesClick.bind(this);
		this.handleModalButtonClick = this.handleModalButtonClick.bind(this);
		this.saveState				= this.saveState.bind(this);
	}

	componentDidMount() {
		var self = this;
		this.props.changeActivePage("solve");
		setTimeout(function() {
			const storedState = JSON.parse(localStorage.getItem('solveState'));
			if (storedState && storedState.finishedGrid && storedState.finishedGrid.length) {
				// dont keep track of ignored days/notes mode
				delete storedState.ignoredDays;
				delete storedState.notesMode;
				storedState.progressSaved = true;
				storedState.paused = true;
			
				console.log('recalling state ', storedState.timerValue);
				console.log(storedState);
				self.setState(storedState);
			} else {
				self.setupPuzzle()
			}
		}, 0);

		document.addEventListener("keydown", this.handleKeyDown);
		smoothscroll.polyfill();
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);
	}

	setupPuzzle() {
		var self = this;
		fetchRandomData(this.state.ignoredDays)
			.then(response => {
				// only allow 15x15 or 21x21 puzzles
				if (response && response.data && response.data.size 
					&& ((response.data.size.cols === 15 && response.data.size.rows === 15)
					|| (response.data.size.cols === 21 && response.data.size.rows === 21))
					&& !utils.isRebus(response.data.grid)) {
					console.log(response.data);

					const finishedGrid = makeFinishedGrid(response.data.grid);
					const grid = finishedGrid.slice().map(char => char ? null : char);
					const clues = makeClues(response.data.clues, response.data.gridnums);

					self.setState({
						finishedGrid: finishedGrid,
						clues: clues,
						grid: grid,
						rowLength: response.data.size.cols,
						isAcross: true,
						labels: utils.makeLabels(clues),
						puzzleDate: response.data.date,
						puzzleAuthor: response.data.author,
						activeClue: utils.findFirstActiveClues(true, clues),
						altDirectionActiveClue: utils.findFirstActiveClues(false, clues),
						activeCell: utils.findFirstActiveCells(grid, true, response.data.size.cols)[0],
						activeClueCells: utils.findFirstActiveCells(grid, true, response.data.size.cols)[1],
						correctCells: [],
						incorrectCells: [],
						revealedCells: [],
						noteCells: [],
						greyedClues: [],
						loading: false,
						paused: false,
						timerValue: 0,
						shouldCheckFinishedGrid: true,
						correct: false,
						finished: false,
						progressSaved: false
					});
				} else {
					console.log('Fetching new puzzle');
					self.setupPuzzle();
				}
			})
			.catch(error => {
				console.log('Error: ', error);
				self.setupPuzzle();
			});

		console.log(this.state);
	}

	// save state to local storage
	saveState() {
		console.log('saving state ', this.state.timerValue);
		if (!this.state.progressSaved) {
			localStorage.setItem('solveState', JSON.stringify(this.state));
			this.setState({progressSaved: true});
		}
	}

	handleKeyDown(e) {
		if (this.state.loading || this.state.paused || !this.state.hasStarted) {
			return;
		}

		// ignore meta keys
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
	    }

		// valid characters
		if (e.keyCode >= 65 && e.keyCode <= 90) {
			this.enterValidCharacter(e.key);
		}

		if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
			// get possible new active clue/cells
			const activeClueCellsAcross = utils.findActiveClueCells(this.state.activeCell, true, this.state.grid, this.state.rowLength);
			const activeClueCellsDown = utils.findActiveClueCells(this.state.activeCell, false, this.state.grid, this.state.rowLength);
			const activeClueAcross = utils.getActiveClueFromCell(activeClueCellsAcross[0], this.state.clues, true);
			const activeClueDown = utils.getActiveClueFromCell(activeClueCellsDown[0], this.state.clues, false);

			// left arrow
			if (e.keyCode === 37) {
				if (!this.state.isAcross) {
					this.setState({
						activeClueCells: activeClueCellsAcross,
						activeClue: activeClueAcross,
						altDirectionActiveClue: activeClueDown,
						isAcross: true
					});
				} else {
					this.moveToPrevCell(true, false);
				}
			}

			// up arrow
			if (e.keyCode === 38) {
				if (this.state.isAcross) {
					this.setState({
						activeClueCells: activeClueCellsDown,
						activeClue: activeClueDown,
						altDirectionActiveClue: activeClueAcross,
						isAcross: false
					});
				} else {
					this.moveToPrevCell(false, false);
				}
			}

			// right arrow
			if (e.keyCode === 39) {
				if (!this.state.isAcross) {
					this.setState({
						activeClueCells: activeClueCellsAcross,
						activeClue: activeClueAcross,
						altDirectionActiveClue: activeClueDown,
						isAcross: true
					});
				} else {
					this.moveToNextCell(true, true, false);
				}
			}

			// down arrow
			if (e.keyCode === 40) {
				if (this.state.isAcross) {
					this.setState({
						activeClueCells: activeClueCellsDown,
						activeClue: activeClueDown,
						altDirectionActiveClue: activeClueAcross,
						isAcross: false
					});
				} else {
					this.moveToNextCell(false, true, false);
				}
			}
		}

		// backspace
		if (e.keyCode === 8) {
			// delete if active cell isn't already marked correct
			this.moveToPrevCell(this.state.isAcross, !utils.isCellInGroup(this.state.correctCells, this.state.activeCell));
			this.setState({progressSaved: false});
		}
	}

	enterValidCharacter(key) {
		const wasEmpty = this.state.grid[this.state.activeCell] === null;

		// only assign new value if active cell isnt marked correct
		if (!utils.isCellInGroup(this.state.correctCells, this.state.activeCell)) {
			let newGrid = this.state.grid.slice();

			newGrid[this.state.activeCell] = key.toUpperCase();

			// if cell is marked as incorrect and new value is entered, remove incorrect mark
			if (newGrid[this.state.activeCell] !== this.state.grid[this.state.activeCell]) {
				this.removeIncorrectCell(this.state.activeCell);
			}

			// if we're in notes mode, add active cell to noted cells
			// if we're not and active cell is noted, remove from noted cells
			let newNoteCells = this.state.noteCells.slice();
			const shouldAddNote = this.state.notesMode && !utils.isCellInGroup(this.state.noteCells, this.state.activeCell);
			const shouldDeleteNote = !this.state.notesMode && utils.isCellInGroup(this.state.noteCells, this.state.activeCell);

			if (shouldAddNote) {
				newNoteCells = [...newNoteCells, this.state.activeCell];
			} else if (shouldDeleteNote) {
				newNoteCells = newNoteCells.filter(cell => cell !== this.state.activeCell);
			}

			const newGreyedClues = utils.getGreyedClues(newGrid, this.state.clues, this.state.greyedClues, this.state.activeCell, true, this.state.isAcross, this.state.rowLength);

			this.setState({
				grid: newGrid,
				noteCells: newNoteCells,
				greyedClues: newGreyedClues,
				progressSaved: false
			});
			
			if (utils.isGridComplete(newGrid)) {
				this.checkFinishedPuzzle(newGrid);
				return;
			}
		}

		this.moveToNextCell(this.state.isAcross, false, wasEmpty);
	}

	handleCellClick(e, cell) {
		// don't make blacked out cell active
		if (this.state.grid[cell] !== false) {
			// if cell is double clicked, switch across/down direction
			const isAcross = (this.state.activeCell === cell)
				? !this.state.isAcross
				: this.state.isAcross;

			const activeClueCells = utils.findActiveClueCells(cell, isAcross, this.state.grid, this.state.rowLength);
			const altDirActiveClueCells = utils.findActiveClueCells(cell, !isAcross, this.state.grid, this.state.rowLength);
			const activeClue = utils.getActiveClueFromCell(activeClueCells[0], this.state.clues, isAcross);
			const altDirectionActiveClue = utils.getActiveClueFromCell(altDirActiveClueCells[0], this.state.clues, !isAcross);

			this.setState({
				activeCell: cell,
				activeClueCells: activeClueCells,
				activeClue: activeClue,
				altDirectionActiveClue: altDirectionActiveClue,
				isAcross: isAcross
			});
		}
	}

	handleClueClick(e, clueNum) {
		let newActiveClue = {};
		newActiveClue[clueNum] = this.state.clues[clueNum];

		const [activeCell, activeClueCells, isAcross] = utils.getActiveCellsFromClue(newActiveClue, this.state.grid, this.state.rowLength);

		const altDirClueFirstCell = utils.findActiveClueCells(activeCell, !isAcross, this.state.grid, this.state.rowLength)[0];
		const altDirectionActiveClue = utils.getActiveClueFromCell(altDirClueFirstCell, this.state.clues, !isAcross);

		this.setState({
			activeClue: newActiveClue,
			altDirectionActiveClue: altDirectionActiveClue,
			activeCell: activeCell,
			activeClueCells: activeClueCells,
			isAcross: isAcross
		});
	}

	handleNewPuzzleClick(e) {
		const self = this;
		if (this.state.ignoredDays.length >= 7) {
			alert("No days selected");
			return;
		}
		this.setState({loading: true, hasStarted: false});

		// fake loading time
		setTimeout(() => {
			self.setupPuzzle()
		}, 1); 
	}

	handleCheckClick(type) {
		// get cells to check and add incorrect ones to current list of incorrect cells
		let incorrectCells = this.state.incorrectCells.slice();
		let correctCells = this.state.correctCells.slice();
		let cellsToCheck;

		switch(type) {
			// square
			case 0:
				cellsToCheck = [this.state.activeCell];
				break;
			// clue
			case 1: 
				cellsToCheck = utils.findActiveClueCells(this.state.activeCell, this.state.isAcross, this.state.grid, this.state.rowLength);
				break;
			// puzzle
			case 2:
				cellsToCheck = utils.findAllCells(this.state.grid);
				break;

			default:
				cellsToCheck = [];
				break
		}

		cellsToCheck.forEach(cell => {
			let currentGridValue = this.state.grid[cell];
			let finishedGridValue = this.state.finishedGrid[cell];

			if (currentGridValue !== null && !utils.isCellInGroup(this.state.correctCells, cell)) {
				if (currentGridValue === finishedGridValue) {
					correctCells.push(cell);
				} else {
					incorrectCells.push(cell);
				}
			}

			this.setState({
				incorrectCells: incorrectCells,
				correctCells: correctCells,
				progressSaved: false
			});
		});
	}

	handleRevealClick(type) {
		let revealedCells = this.state.revealedCells.slice();
		let correctCells = this.state.correctCells.slice();
		let incorrectCells = this.state.incorrectCells.slice();
		let cellsToReveal;

		switch(type) {
			// square
			case 0:
				cellsToReveal = [this.state.activeCell];
				break;
			// clue
			case 1: 
				cellsToReveal = utils.findActiveClueCells(this.state.activeCell, this.state.isAcross, this.state.grid, this.state.rowLength);
				break;
			// puzzle
			case 2:
				cellsToReveal = utils.findAllCells(this.state.grid);
				break;

			default:
				cellsToReveal = [];
				break
		}

		let newGrid = this.state.grid.slice();
		cellsToReveal.forEach(cell => {
			if (!utils.isCellInGroup(this.state.revealedCells, cell)) {
				// if current value is incorrect, make it correct and mark as revealed (giving it red marker)
				if (this.state.grid[cell] !== this.state.finishedGrid[cell]) {
					newGrid[cell] = this.state.finishedGrid[cell];
					revealedCells.push(cell);
					// remove cell from incorrect list if present
					if (utils.isCellInGroup(incorrectCells, cell)) {
						utils.removeArrayItem(incorrectCells, cell);
					}
				}

				// every revealed cell is also marked as correct
				if (!utils.isCellInGroup(this.state.correctCells, cell)) {
					correctCells.push(cell);
				}
			}
		});

		const newGreyedClues = utils.getGreyedClues(newGrid, this.state.clues, this.state.greyedClues, this.state.activeCell, true, this.state.isAcross, this.state.rowLength);

		this.setState({
			revealedCells: revealedCells,
			correctCells: correctCells,
			greyedClues: newGreyedClues,
			incorrectCells: incorrectCells,
			grid: newGrid,
			progressSaved: false
		});

		if (utils.isGridComplete(newGrid)) {
			this.checkFinishedPuzzle(newGrid);
		}
	}

	handleClearClick(e) {
		const newGrid = this.state.finishedGrid.slice().map(char => char ? null : char);
		this.setState({
			grid: newGrid,
			revealedCells: [],
			correctCells: [],
			incorrectCells: [],
			greyedClues: [],
			shouldCheckFinishedGrid: true
		});
	}

	handleNotesClick(e) {
		this.setState({notesMode: !this.state.notesMode});
	}

	handleTimerPause() {
		this.setState({paused: true});
	}

	handleTimerUpdate(timerValue) {
		console.log('timer update: ', timerValue);
		this.setState({timerValue: timerValue});
	}

	// for days difficulty dropdown
	handleCheckboxChange(e) {
		const idx = this.state.ignoredDays.indexOf(e.target.id);
		if (idx > -1) {
			let ignoredDaysCopy = [...this.state.ignoredDays];
			ignoredDaysCopy.splice(idx, 1);
			this.setState({ignoredDays: ignoredDaysCopy});
		} else {
			this.setState({ignoredDays: [...this.state.ignoredDays, e.target.id]});
		}
	}

	handleModalButtonClick(e) {
		this.setState({
			paused: false,
			hasStarted: true
		});
	}

	moveToNextCell(isAcross, ignoreUnfinishedClues, wasEmptyCell) {
		let currentCell = this.state.activeCell;
		let foundNextCell = false;

		// find next closest empty cell
		while (!foundNextCell) {
			let activeClueCells = utils.findActiveClueCells(currentCell, isAcross, this.state.grid, this.state.rowLength);
			let endOfClue = activeClueCells[activeClueCells.length - 1] === currentCell;
				
			let unfinishedClue = false;
			if (endOfClue && !ignoreUnfinishedClues) {
				unfinishedClue = activeClueCells.some(cell => {
					return this.state.grid[cell] === null 
						&& this.state.activeCell !== cell ;
				});
			}

			if (unfinishedClue) {
				// if we reach the end by filling a cell and the current clue has an empty cell somewhere, 
				// go back to first cell in clue and eventually find empty cell
				currentCell = activeClueCells[0];
			} else if (isAcross) {	
				// if across, always move laterally and loop back to cell 0 for a new row
				currentCell += 1;
			} else {
				// if down, move down within clue, then move to next down clue
				let clueStartCell = activeClueCells[0];
				let activeClue = utils.getActiveClueFromCell(clueStartCell, this.state.clues, isAcross);
				// let endOfClue = currentCell === activeClueCells[activeClueCells.length - 1];

				if (endOfClue) {
					currentCell = utils.getNextDownClueStartCell(activeClue, this.state.clues);
				} else {
					currentCell += this.state.rowLength;
				}
			}

			// return to first cell if we're at the last cell
			if (Math.floor(currentCell / this.state.rowLength) > this.state.rowLength - 1 
				|| currentCell % this.state.rowLength > this.state.rowLength - 1) {
				currentCell = 0;
			}

			// if previously filled cell was empty, don't stop until we find next empty cell
			// if it had value, stop at next valid cell we find, even if it had a value
			foundNextCell = wasEmptyCell 
				? (this.state.grid[currentCell] === null) 
				: (this.state.grid[currentCell] !== false);
		}

		const startOfClue = utils.findActiveClueCells(currentCell, isAcross, this.state.grid, this.state.rowLength)[0];
		const startOfAltDirClue = utils.findActiveClueCells(currentCell, !isAcross, this.state.grid, this.state.rowLength)[0];

		this.setState({
			activeCell: currentCell,
			activeClueCells: utils.findActiveClueCells(currentCell, isAcross, this.state.grid, this.state.rowLength),
			activeClue: utils.getActiveClueFromCell(startOfClue, this.state.clues, isAcross),
			altDirectionActiveClue: utils.getActiveClueFromCell(startOfAltDirClue, this.state.clues, !isAcross)
		});
	}

	moveToPrevCell(isAcross, shouldDelete) {
		let currentCell = this.state.activeCell;
		let foundNextCell = false;

		while (!foundNextCell) {
			let activeClueCells = utils.findActiveClueCells(currentCell, isAcross, this.state.grid, this.state.rowLength);

			if (isAcross) {
				currentCell -= 1;
			} else {
				let clueStartCell = activeClueCells[0];
				let activeClue = utils.getActiveClueFromCell(clueStartCell, this.state.clues, isAcross);
				let startOfClue = activeClueCells[0] === currentCell;

				if (startOfClue) {
					currentCell = utils.getPreviousDownClueEndCell(activeClue, this.state.clues, this.state.grid, this.state.rowLength);
				} else {
					currentCell -= this.state.rowLength;
				}
			}
			 
			// don't do anything if we're at first cell
			if (currentCell < 0) {
				return;
			}

			foundNextCell = this.state.grid[currentCell] !== false;
		}

		const newActiveCell = currentCell;

		// TODO: DELETE WHEN CELL [0,0]

		const stayOnCell = this.state.grid[this.state.activeCell] !== null && shouldDelete;
		let newGrid = this.state.grid.slice();

		// delete active cell value, and previous cell value if the active cell is empty
		if (shouldDelete) {
			newGrid[this.state.activeCell] = null;
			if (!stayOnCell && !utils.isCellInGroup(this.state.correctCells, newActiveCell)) {
				newGrid[newActiveCell] = null;
			}

			// if we delete checked incorrect cells, remove from incorrect cells
			this.removeIncorrectCell(this.state.activeCell, !stayOnCell ? newActiveCell : null);
		}

		const newGreyedClues = utils.getGreyedClues(newGrid, this.state.clues, this.state.greyedClues, stayOnCell ? this.state.activeCell : newActiveCell, 
			false, isAcross, this.state.rowLength);

		// use different cell to find active clue depending on if we moved or stayed cells
		const newClueCell = stayOnCell ? this.state.activeCell : newActiveCell;
		const startOfClue = utils.findActiveClueCells(newClueCell, isAcross, this.state.grid, this.state.rowLength)[0];
		const startOfAltDirClue = utils.findActiveClueCells(newClueCell, !isAcross, this.state.grid, this.state.rowLength)[0];

		// if active cell had value, stay there. otherwise, move to previous cell
		this.setState({
			grid: newGrid,
			activeCell: stayOnCell ? this.state.activeCell : newActiveCell,
			activeClueCells: stayOnCell ? this.state.activeClueCells : utils.findActiveClueCells(newActiveCell, isAcross, this.state.grid, this.state.rowLength),
			activeClue: utils.getActiveClueFromCell(startOfClue, this.state.clues, isAcross),
			altDirectionActiveClue: utils.getActiveClueFromCell(startOfAltDirClue, this.state.clues, !isAcross),
			greyedClues: newGreyedClues
		});
	}

	// delete previous cell as well if its not null
	removeIncorrectCell(cellToRemove, prevCell) {
		const filteredIncorrectCells = this.state.incorrectCells.filter(cell => {
			return cellToRemove !== cell && (!prevCell || prevCell !== cell);
		});

		this.setState({incorrectCells: filteredIncorrectCells});
	}

	checkFinishedPuzzle(newGrid) {
		// stop verifying if they've already finished successfully
		if (this.state.shouldCheckFinishedGrid) {
			const puzzleCorrect = JSON.stringify(newGrid) === JSON.stringify(this.state.finishedGrid);
			this.setState({
				shouldCheckFinishedGrid: !puzzleCorrect,
				paused: true,
				finished: true,
				correct: puzzleCorrect
			});
		}
	}

	shouldBlurBackground() {
		return (this.state.paused || !this.state.hasStarted) && !this.state.loading;
	}

	render() {
		const body = this.state.loading ? 
		
			<LoaderContainer>
				<ClipLoader 
					size={100}
					color={"#a7d8ff"}
					loading={true} />
			</LoaderContainer> :

			(<BodyContainer>
		    	<GridHalf>
					<GridHalfRail>
						<PuzzleHeader date={this.state.puzzleDate} author={this.state.puzzleAuthor} />

						<ClueBanner 
							mode="solve"
							label={Object.keys(this.state.activeClue)[0]}
							clue={this.state.activeClue[Object.keys(this.state.activeClue)[0]]} />

					    <Grid 
					        grid={this.state.grid}
				     	    rowLength={this.state.rowLength} 
				     	    activeCell={this.state.activeCell}
				     	    activeClueCells={this.state.activeClueCells}
				     	    correctCells={this.state.correctCells}
				     	    incorrectCells={this.state.incorrectCells}
				     	    revealedCells={this.state.revealedCells}
				     	    noteCells={this.state.noteCells}
				     	    handleCellClick={this.handleCellClick}
				     	    labels={this.state.labels} />
		     	    </GridHalfRail>
	     		</GridHalf>
	     		<CluesHalf>
					<Clues 
						mode="solve"
						clues={this.state.clues}
						grid={this.state.grid}
						activeClue={this.state.activeClue}
						altDirectionActiveClue={this.state.altDirectionActiveClue}
						greyedClues={this.state.greyedClues}
						handleClueClick={this.handleClueClick} />
	     		</CluesHalf>
     		</BodyContainer>);

		return (
			<Fragment>
				<StyledSolve blurred={(this.state.paused || !this.state.hasStarted) && !this.state.loading}>
					<NavContainer>
						<NavWrapper 
							mode="solve"
							toggleSidebarOpen={this.props.toggleSidebarOpen}
							handleTimerPause={this.handleTimerPause}
							handleTimerUpdate={this.handleTimerUpdate}
							handleNewPuzzleClick={this.handleNewPuzzleClick} 
							handleCheckClick={this.handleCheckClick}
							handleRevealClick={this.handleRevealClick}
							handleClearClick={this.handleClearClick}
							handleNotesClick={this.handleNotesClick}
							handleSaveClick={this.saveState}
							notesMode={this.notesMode}
							onCheckboxChange={this.handleCheckboxChange}
							progressSaved={this.state.progressSaved}
							timerValue={this.state.timerValue}
							hasStarted={this.state.hasStarted}
							finished={this.state.finished}
							paused={this.state.paused}
							correct={this.state.correct} />
					</NavContainer>
					{body}
			    </StyledSolve> 

			    <Modal 
					handleModalButtonClick={this.handleModalButtonClick}
					hasStarted={this.state.hasStarted}
					loading={this.state.loading}
					paused={this.state.paused}
					timerValue={this.state.timerValue}
					finished={this.state.finished}
					correct={this.state.correct} />
		   </Fragment>
		);
	}
}

const StyledSolve = styled.div`
	max-width: 100vw;
	max-height: 100vh;
	height: 100vh;
	width: 100vw;
	transition: filter 300ms ease-in-out;
	filter: ${props => props.blurred ? "blur(3px)" : "blur(0)"};
`;

const LoaderContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -50px;
	margin-left: -50px;
`;

const NavContainer = styled.div`
	height: 45px;
    width: 100%;
`;

const BodyContainer = styled.div`
	max-width: 100%;
	max-height: 100%;
	height: calc(100% - 53px);
	display: flex;
`;

const GridHalf = styled.div`
	width: 50%;
	@media (max-width: 1000px) {
		width: 45%;
	}
	@media (max-width: 920px) {
		width: 410px;
	}
	@media (max-width: 650px) {
		width: 40%;
      	min-width: 360px;
	}	
`;

const GridHalfRail = styled.div`
	height: 100%;
	width: 480px;
	margin: 0 auto;
	@media (max-width: 1000px) {
		width: 400px;
      	padding-top: 10px;
	}
	@media (max-width: 650px) {
		width: 350px;
	}	
`;

const CluesHalf = styled.div`
	width: 50%;
	@media (max-width: 1000px) {
		width: 55%;
	}
	@media (max-width: 920px) {
		max-width: 450px;
		margin-left: 20px;
	}
	@media (max-width: 650px) {
		width: 60%;
      	margin-left: 10px;
	}	
`;

export default Solve;
