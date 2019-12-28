import React, { Component } from 'react';
import './App.css';
import { fetchRandomData, makeFinishedGrid, makeClues } from './util/data';
import * as utils from './util/utilities';

import Nav from './components/Nav';
import Grid from './components/Grid';
import Clues from './components/Clues';
import ClueBanner from './components/ClueBanner';
import PuzzleHeader from './components/PuzzleHeader';


class App extends Component {
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
			puzzleDate: null,
			puzzleAuthor: null,
			isAcross: true,
			notesMode: false,
			ignoredDays: ["sunday"],
			labels: [],
			loading: true,
			paused: false,
			hasStarted: false,
			shouldCheckFinishedGrid: true
		}

		this.handleCellClick        = this.handleCellClick.bind(this);
		this.handleClueClick        = this.handleClueClick.bind(this);
		this.handleKeyDown          = this.handleKeyDown.bind(this);
		this.handleNewPuzzleClick   = this.handleNewPuzzleClick.bind(this);
		this.handleCheckClick       = this.handleCheckClick.bind(this);
		this.handleRevealClick      = this.handleRevealClick.bind(this);
		this.handleClearClick       = this.handleClearClick.bind(this);
		this.handleCheckboxChange   = this.handleCheckboxChange.bind(this);
		this.handleNotesClick       = this.handleNotesClick.bind(this);
		this.handleModalButtonClick = this.handleModalButtonClick.bind(this);
		this.isGreyedClue           = this.isGreyedClue.bind(this);
	}

	setupPuzzle() {
		var self = this;
		fetchRandomData(this.state.ignoredDays)
			.then(response => {
				if (response && response.data && response.data.size && response.data.size.cols === 15 && response.data.size.rows === 15) {
					console.log(response.data);

					let finishedGrid = makeFinishedGrid(response.data.grid);
					let grid = finishedGrid.slice().map(row => row.slice().map(char => char ? null : char));
					let clues = makeClues(response.data.clues, response.data.gridnums);

					self.setState({
						finishedGrid: finishedGrid,
						clues: clues,
						grid: grid,
						rowLength: finishedGrid.length,
						labels: self.makeLabels(clues),
						puzzleDate: response.data.date,
						puzzleAuthor: response.data.author,
						activeClue: utils.findFirstActiveClues(true, clues),
						altDirectionActiveClue: utils.findFirstActiveClues(false, clues),
						activeCell: utils.findFirstActiveCells(grid, true, finishedGrid.length)[0],
						activeClueCells: utils.findFirstActiveCells(grid, true, finishedGrid.length)[1],
						correctCells: [],
						incorrectCells: [],
						revealedCells: [],
						noteCells: [],
						loading: false,
						paused: false
					});
				} else {
					console.log('incorrect size');
					self.setupPuzzle();
				}
			})
			.catch(error => {
				console.log('error: ', error);
				self.setupPuzzle();
			});
	}

	componentDidMount() {
		var self = this;
		setTimeout(function() {
			self.setupPuzzle()
		}, 1000);

		document.addEventListener("keydown", this.handleKeyDown);
	}

	handleKeyDown(e) {
		if (this.state.loading || this.state.paused || !this.state.hasStarted) {
			return;
		}

		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
	        e.preventDefault();
	    }

	    let [activeRow, activeCol] = this.state.activeCell;

		// valid characters
		if (e.keyCode >= 65 && e.keyCode <= 90) {
			let wasEmpty = this.state.grid[activeRow][activeCol] === null;

			// only assign new value if active cell isnt marked correct
			if (!this.isCellInGroup(this.state.correctCells, this.state.activeCell)) {
				let newGrid = this.state.grid.slice().map(row => row.slice());

				newGrid[activeRow][activeCol] = e.key.toUpperCase();

				// if cell is marked as incorrect and new value is entered, remove incorrect mark
				if (newGrid[activeRow][activeCol] !== this.state.grid[activeRow][activeCol]) {
					this.removeIncorrectCell(this.state.activeCell);
				}

				// if we're in notes mode, add active cell to noted cells
				// if we're not and active cell is noted, remove from noted cells
				let newNoteCells = this.state.noteCells.slice();
				let shouldAddNote = this.state.notesMode && !this.isCellInGroup(this.state.noteCells, this.state.activeCell);
				let shouldDeleteNote = !this.state.notesMode && this.isCellInGroup(this.state.noteCells, this.state.activeCell);

				if (shouldAddNote) {
					newNoteCells = [...newNoteCells, this.state.activeCell];
				} else if (shouldDeleteNote) {
					newNoteCells = newNoteCells.filter(([cellRow, cellCol]) => {
						return !(cellRow === this.state.activeCell[0] && cellCol === this.state.activeCell[1]);
					});
				}

				this.setState({
					grid: newGrid,
					noteCells: newNoteCells
				});
				
				if (utils.isGridComplete(newGrid)) {
					if (this.state.shouldCheckFinishedGrid) {
						if (JSON.stringify(newGrid) === JSON.stringify(this.state.finishedGrid)) {
							// stop verifying if they've already finished successfully
							this.setState({shouldCheckFinishedGrid: false});
							setTimeout(() => {alert("Correct!")}, 300);
						} else {
							setTimeout(() => {alert("One or more squares are incorrect!")}, 300);
						}
					}

					return;
				}
			}

			this.moveToNextCell(this.state.isAcross, false, wasEmpty);
		}

		// left arrow
		if (e.keyCode === 37) {
			if (!this.state.isAcross) {
				let activeClueCells = utils.findActiveClueCells(this.state.activeCell, true, this.state.grid, this.state.rowLength);
				let altDirActiveClueCells = utils.findActiveClueCells(this.state.activeCell, false, this.state.grid, this.state.rowLength);
				let activeClue = utils.getActiveClueFromCell(activeClueCells[0], this.state.clues, true);
				let altDirectionActiveClue = utils.getActiveClueFromCell(altDirActiveClueCells[0], this.state.clues, false);

				this.setState({
					activeClueCells: activeClueCells,
					activeClue: activeClue,
					altDirectionActiveClue: altDirectionActiveClue,
					isAcross: true
				});
			} else {
				this.moveToPrevCell(this.state.isAcross, false);
			}
		}

		// up arrow
		if (e.keyCode === 38) {
			if (this.state.isAcross) {
				let activeClueCells = utils.findActiveClueCells(this.state.activeCell, false, this.state.grid, this.state.rowLength);
				let altDirActiveClueCells = utils.findActiveClueCells(this.state.activeCell, true, this.state.grid, this.state.rowLength);
				let activeClue = utils.getActiveClueFromCell(activeClueCells[0], this.state.clues, false);
				let altDirectionActiveClue = utils.getActiveClueFromCell(altDirActiveClueCells[0], this.state.clues, true);

				this.setState({
					activeClueCells: activeClueCells,
					activeClue: activeClue,
					altDirectionActiveClue: altDirectionActiveClue,
					isAcross: false
				});
			} else {
				this.moveToPrevCell(this.state.isAcross, false);
			}
		}

		// right arrow
		if (e.keyCode === 39) {
			// if we're down, switch to across and don't move cells. otherwise move right
			if (!this.state.isAcross) {
				let activeClueCells = utils.findActiveClueCells(this.state.activeCell, true, this.state.grid, this.state.rowLength);
				let altDirActiveClueCells = utils.findActiveClueCells(this.state.activeCell, false, this.state.grid, this.state.rowLength);
				let activeClue = utils.getActiveClueFromCell(activeClueCells[0], this.state.clues, true);
				let altDirectionActiveClue = utils.getActiveClueFromCell(altDirActiveClueCells[0], this.state.clues, false);

				this.setState({
					activeClueCells: activeClueCells,
					activeClue: activeClue,
					altDirectionActiveClue: altDirectionActiveClue,
					isAcross: true
				});
			} else {
				this.moveToNextCell(true, true, false);
			}
		}

		// down arrow
		if (e.keyCode === 40) {
			// if we're across, switch to down and don't move cells. otherwise move down
			if (this.state.isAcross) {
				let activeClueCells = utils.findActiveClueCells(this.state.activeCell, false, this.state.grid, this.state.rowLength);
				let altDirActiveClueCells = utils.findActiveClueCells(this.state.activeCell, true, this.state.grid, this.state.rowLength);
				let activeClue = utils.getActiveClueFromCell(activeClueCells[0], this.state.clues, false);
				let altDirectionActiveClue = utils.getActiveClueFromCell(altDirActiveClueCells[0], this.state.clues, true);

				this.setState({
					activeClueCells: activeClueCells,
					activeClue: activeClue,
					altDirectionActiveClue: altDirectionActiveClue,
					isAcross: false
				});
			} else {
				this.moveToNextCell(false, true, false);
			}
		}

		// backspace
		if (e.keyCode === 8) {
			// delete if active cell isn't already marked correct
			this.moveToPrevCell(this.state.isAcross, !this.isCellInGroup(this.state.correctCells, this.state.activeCell));
		}
	}

	handleCellClick(e, row, col) {
		// don't make blacked out cell active
		if (this.state.grid[row][col] !== false) {
			// if cell is double clicked, switch across/down direction
			let isAcross = (this.state.activeCell[0] === row && this.state.activeCell[1] === col)
				? !this.state.isAcross
				: this.state.isAcross;

			let activeClueCells = utils.findActiveClueCells([row, col], isAcross, this.state.grid, this.state.rowLength);
			let altDirActiveClueCells = utils.findActiveClueCells([row, col], !isAcross, this.state.grid, this.state.rowLength);
			let activeClue = utils.getActiveClueFromCell(activeClueCells[0], this.state.clues, isAcross);
			let altDirectionActiveClue = utils.getActiveClueFromCell(altDirActiveClueCells[0], this.state.clues, !isAcross);

			this.setState({
				activeCell: [row,col],
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

		let [activeCell, activeClueCells, isAcross] = utils.getActiveCellsFromClue(newActiveClue, this.state.grid, this.state.rowLength);

		let altDirClueFirstCell = utils.findActiveClueCells(activeCell, !isAcross, this.state.grid, this.state.rowLength)[0];
		let altDirectionActiveClue = utils.getActiveClueFromCell(altDirClueFirstCell, this.state.clues, !isAcross);

		this.setState({
			activeClue: newActiveClue,
			altDirectionActiveClue: altDirectionActiveClue,
			activeCell: activeCell,
			activeClueCells: activeClueCells,
			isAcross: isAcross
		});
	}

	handleNewPuzzleClick(e) {
		let self = this;
		if (this.state.ignoredDays.length >= 7) {
			alert("No days selected");
			return;
		}

		this.setState({loading: true});
		setTimeout(() => {
			self.setupPuzzle()
		}, 1000); 

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
				cellsToCheck = utils.findAllCells(this.state.grid, this.state.rowLength);
				break;

			default:
				cellsToCheck = [];
				break
		}

		cellsToCheck.forEach(([cellRow, cellCol]) => {
			let currentGridValue = this.state.grid[cellRow][cellCol];
			let finishedGridValue = this.state.finishedGrid[cellRow][cellCol];

			if (currentGridValue !== null && !this.isCellInGroup(this.state.correctCells, [cellRow, cellCol])) {
				if (currentGridValue === finishedGridValue) {
					correctCells.push([cellRow, cellCol]);
				} else {
					incorrectCells.push([cellRow, cellCol]);
				}
			}

			this.setState({
				incorrectCells: incorrectCells,
				correctCells: correctCells
			});
		});
	}

	handleRevealClick(type) {
		let revealedCells = this.state.revealedCells.slice();
		let correctCells = this.state.correctCells.slice();
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
				cellsToReveal = utils.findAllCells(this.state.grid, this.state.rowLength);
				break;

			default:
				cellsToReveal = [];
				break
		}

		let newGrid = this.state.grid.slice().map(row => row.slice());
		cellsToReveal.forEach(([cellRow, cellCol]) => {
			if (!this.isCellInGroup(this.state.revealedCells, [cellRow, cellCol])) {
				// if current value is incorrect, make it correct and mark as revealed (giving it red marker)
				if (this.state.grid[cellRow][cellCol] !== this.state.finishedGrid[cellRow][cellCol]) {
					newGrid[cellRow][cellCol] = this.state.finishedGrid[cellRow][cellCol];
					revealedCells.push([cellRow, cellCol]);
				}

				// every revealed cell is also marked as correct
				if (!this.isCellInGroup(this.state.correctCells, [cellRow, cellCol])) {
					correctCells.push([cellRow, cellCol]);
				}
			}
		});

		this.setState({
			revealedCells: revealedCells,
			correctCells: correctCells,
			grid: newGrid
		});
	}

	handleClearClick(e) {
		let newGrid = this.state.finishedGrid.slice().map(row => row.slice().map(char => char ? null : char));
		this.setState({
			grid: newGrid,
			revealedCells: [],
			correctCells: [],
			incorrectCells: []
		});
	}

	handleNotesClick(e) {
		this.setState({notesMode: !this.state.notesMode});
	}

	handleCheckboxChange(e) {
		let idx = this.state.ignoredDays.indexOf(e.target.id);
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
			loading: false,
			hasStarted: true
		});
	}

	moveToNextCell(isAcross, ignoreUnfinishedClues, wasEmptyCell) {
		let currentCell = this.state.activeCell;
		let foundNextCell = false;
		let nextCellRow;
		let nextCellCol;

		// find next closest empty cell
		while (!foundNextCell) {
			let activeClueCells = utils.findActiveClueCells(currentCell, isAcross, this.state.grid, this.state.rowLength);
			let endOfClue = activeClueCells[activeClueCells.length - 1][0] === currentCell[0] 
							 && activeClueCells[activeClueCells.length - 1][1] === currentCell[1];
				
			let unfinishedClue = false;
			if (endOfClue && !ignoreUnfinishedClues) {
				unfinishedClue = activeClueCells.some(cell => {
					return this.state.grid[cell[0]][cell[1]] === null 
						&& !(this.state.activeCell === cell[0] 
						&& this.state.activeCell === cell[1]);
				});
			}

			if (unfinishedClue) {
				// if we reach the end by filling a cell and the current clue has an empty cell somewhere, 
				// go back to first cell in clue and eventually find empty cell
				[nextCellRow, nextCellCol] = activeClueCells[0];
				currentCell = [nextCellRow, nextCellCol];	
			} else if (isAcross) {	
				// if across, always move laterally and loop back to cell 0 for a new row
				let endOfRow = currentCell[1] === this.state.rowLength - 1;
				nextCellRow = endOfRow ? currentCell[0] + 1 : currentCell[0];
				nextCellCol = endOfRow ? 0 : currentCell[1] + 1;
				currentCell = [nextCellRow, nextCellCol];
			} else {
				// if down, move down within clue, then move to next down clue
				let clueStartCell = activeClueCells[0];
				let activeClue = utils.getActiveClueFromCell(clueStartCell, this.state.clues, isAcross);
				let endOfClue = currentCell[0] === activeClueCells[activeClueCells.length - 1][0] 
						     && currentCell[1] === activeClueCells[activeClueCells.length - 1][1]; 

				if (endOfClue) {
					[nextCellRow, nextCellCol] = utils.getNextDownClueStartCell(activeClue, this.state.clues);
					currentCell = [nextCellRow, nextCellCol];
				} else {
					nextCellRow = currentCell[0] + 1;
					nextCellCol = currentCell[1];
					currentCell = [nextCellRow, nextCellCol];
				}
			}

			// don't do anything if we're at the last cell
			if (nextCellRow > this.state.rowLength - 1 || nextCellCol > this.state.rowLength - 1) {
				[nextCellRow, nextCellCol] = currentCell = [0,0];
			}

			// if previously filled cell was empty, don't stop until we find next empty cell
			// if it had value, stop at next valid cell we find, even if it had a value
			foundNextCell = wasEmptyCell 
				? (this.state.grid[nextCellRow][nextCellCol] === null) 
				: (this.state.grid[nextCellRow][nextCellCol] !== false);
		}

		let startOfClue = utils.findActiveClueCells(currentCell, isAcross, this.state.grid, this.state.rowLength)[0];
		let startOfAltDirClue = utils.findActiveClueCells(currentCell, !isAcross, this.state.grid, this.state.rowLength)[0];

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

		let startOfRow;
		let prevCellRow;
		let prevCellCol;

		while (!foundNextCell) {
			let activeClueCells = utils.findActiveClueCells(currentCell, isAcross, this.state.grid, this.state.rowLength);

			if (isAcross) {
				startOfRow = currentCell[1] === 0;
				prevCellRow = startOfRow ? currentCell[0] - 1 : currentCell[0];
				prevCellCol = startOfRow ? this.state.rowLength - 1 : currentCell[1] - 1;
				currentCell = [prevCellRow, prevCellCol];
			} else {
				let clueStartCell = activeClueCells[0];
				let activeClue = utils.getActiveClueFromCell(clueStartCell, this.state.clues, isAcross);
				let startOfClue = activeClueCells[0][0] === currentCell[0] 
							   && activeClueCells[0][1] === currentCell[1];

				if (startOfClue) {
					[prevCellRow, prevCellCol] = utils.getPreviousDownClueEndCell(activeClue, this.state.clues, this.state.grid, this.state.rowLength);
					currentCell = [prevCellRow, prevCellCol];
				} else {
					prevCellRow = currentCell[0] - 1;
					prevCellCol = currentCell[1];
					currentCell = [prevCellRow, prevCellCol];
				}
			}
			 
			// don't do anything if we're at first cell
			if (prevCellRow < 0 || prevCellCol < 0) {
				return;
			}

			foundNextCell = this.state.grid[prevCellRow][prevCellCol] !== false;
		}

		let newActiveCell = currentCell;

		// TODO: DELETE WHEN CELL [0,0]

		let stayOnCell = this.state.grid[this.state.activeCell[0]][this.state.activeCell[1]] !== null && shouldDelete;
		let newGrid = this.state.grid.slice().map(row => row.slice());

		// delete active cell value, and previous cell value if the active cell is empty
		if (shouldDelete) {
			newGrid[this.state.activeCell[0]][this.state.activeCell[1]] = null;
			if (!stayOnCell && !this.isCellInGroup(this.state.correctCells, [prevCellRow, prevCellCol])) {
				newGrid[prevCellRow][prevCellCol] = null;
			}

			// if we delete checked incorrect cells, remove from incorrect cells
			this.removeIncorrectCell([this.state.activeCell[0], this.state.activeCell[1]], !stayOnCell ? [prevCellRow, prevCellCol] : null);
		}

		let startOfClue = utils.findActiveClueCells(newActiveCell, isAcross, this.state.grid, this.state.rowLength)[0];
		let startOfAltDirClue = utils.findActiveClueCells(newActiveCell, !isAcross, this.state.grid, this.state.rowLength)[0];

		// if active cell had value, stay there. otherwise, move to previous cell
		this.setState({
			grid: newGrid,
			activeCell: stayOnCell ? this.state.activeCell : newActiveCell,
			activeClueCells: stayOnCell ? this.state.activeClueCells : utils.findActiveClueCells(newActiveCell, isAcross, this.state.grid, this.state.rowLength),
			activeClue: utils.getActiveClueFromCell(startOfClue, this.state.clues, isAcross),
			altDirectionActiveClue: utils.getActiveClueFromCell(startOfAltDirClue, this.state.clues, !isAcross)
		});
	}

	// delete previous cell as well if its not null
	removeIncorrectCell([cellRow, cellCol], prevCell) {
		let filteredIncorrectCells = this.state.incorrectCells.filter(cell => {
			return !(cellRow === cell[0] && cellCol === cell[1])
				&& (!prevCell || !(prevCell[0] === cell[0] && prevCell[1] === cell[1]));
		});

		this.setState({incorrectCells: filteredIncorrectCells});
	}

	// for state arrays like correct, revealed, noted cells
	isCellInGroup(cellGroup, [cellRow, cellCol]) {
		return !!cellGroup.find(([row, col]) => {
			return row === cellRow && col === cellCol;
		});
	}

	// returns [starting cell, clue number label]
	makeLabels(clues) {
		return Object.keys(clues).map(clueNum => [clues[clueNum].startCell, clueNum.replace(/\D+/g, '')]);
	}

	isGreyedClue([clueNum, clue]) {
		let clueCells = utils.findActiveClueCells(clue.startCell, clueNum.includes("A"), this.state.grid, this.state.rowLength);
		return !clueCells.some(cell => this.state.grid[cell[0]][cell[1]] === null);
	}

	render() {
		let body = this.state.loading ? "LOADING..." : 
			(<div className="BodyContainer">
		    	<div className="GridHalf">
					<div className="GridHalf-Rail">
						<PuzzleHeader date={this.state.puzzleDate} author={this.state.puzzleAuthor} />

			    		<ClueBanner 
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
				     	    labels={this.state.labels}
				     	    clues={this.state.clues} />
		     	    </div>
	     		</div>
	     		<div className="CluesHalf">
					<Clues 
						clues={this.state.clues}
						grid={this.state.grid}
						activeCell={this.state.activeCell}
						activeClue={this.state.activeClue}
						altDirectionActiveClue={this.state.altDirectionActiveClue}
						handleClueClick={this.handleClueClick}
						isGreyed={this.isGreyedClue} />
	     		</div>
     		</div>);

		return (
			<div className="Container">
				<div className={"App " + (this.state.paused || !this.state.hasStarted ? "blur" : "")}>
					<div className="NavContainer">
						<Nav 
							handleNewPuzzleClick={this.handleNewPuzzleClick} 
							handleCheckClick={this.handleCheckClick}
							handleRevealClick={this.handleRevealClick}
							handleClearClick={this.handleClearClick}
							handleNotesClick={this.handleNotesClick}
							onCheckboxChange={this.handleCheckboxChange} />
					</div>
					{body}
			   </div> 

			   <div className={"ModalOverlay " + (!this.state.paused && this.state.hasStarted ? "hidden" : "")}>
					<div className="ModalContent">
						<p className="ModalText"> 
							{!this.state.hasStarted ? "Ready to start solving?" : "Your game is paused"}
						</p>
						<button className="ModalButton" onClick={this.handleModalButtonClick}>
							{!this.state.hasStarted ? "OK" : "RESUME"}
						</button>
					</div>
				</div>
		   </div>
		);
	}
}

export default App;
