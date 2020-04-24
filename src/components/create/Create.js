import React, { Component, Fragment } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import ClipLoader from 'react-spinners/ClipLoader';
// import '../create/styles/Create.css';
import styled from 'styled-components';
import { buildCreateClues } from '../../util/data';
import * as utils from '../../util/utilities';

import {NavWrapper} from '../common/NavWrapper';
import Grid from '../solve/Grid';
import Clues from '../solve/Clues';
import ClueBanner from '../solve/ClueBanner';
import CreateModal from './CreateModal';
import PuzzleHeader from './PuzzleHeader';

class Create extends Component {
	constructor(props) {
		super(props);

		this.state = {
			grid: [],
			clues: {},
			rowLength: 15,
			activeClue: null,
			altDirectionActiveClue: null,
			activeCell: null,
			activeClueCells: null,
			noteCells: [],
            isAcross: true,
            blankMode: false,
            notesMode: false,
			labels: [],
			loading: true,
			finished: false,
			saveModalOpen: false,
			loadModalOpen: false,
			puzzleName: null
        }
        
		this.handleCellClick        = this.handleCellClick.bind(this);
		this.handleClueClick        = this.handleClueClick.bind(this);
		this.handleClueInput        = this.handleClueInput.bind(this);
        this.handleKeyDown          = this.handleKeyDown.bind(this);
        this.handleBlankClick       = this.handleBlankClick.bind(this);
		this.handleNotesClick       = this.handleNotesClick.bind(this);
		this.handleSaveClick        = this.handleSaveClick.bind(this);
		this.handleLoadClick        = this.handleLoadClick.bind(this);
		this.saveState				= this.saveState.bind(this);
		this.handleModalClose	 	= this.handleModalClose.bind(this);
		this.handleModalSaveClick	= this.handleModalSaveClick.bind(this);
	}

	componentDidMount() {
        var self = this;
        this.props.changeActivePage("create");
		this.timeout = setTimeout(function() {
			const createState = JSON.parse(localStorage.getItem('createState'));
			if (createState && createState.finishedGrid && createState.finishedGrid.length) {
				console.log(createState);
				self.setState(createState);
			} else {
				self.setupPuzzle()
			}
		}, 10);

		document.addEventListener("keydown", this.handleKeyDown);
		smoothscroll.polyfill();
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);
	}

	setupPuzzle() {
        const rowLength = this.state.rowLength;
        const grid = new Array(rowLength * rowLength).fill(null);
        const clues = buildCreateClues(grid, rowLength);
        const labels = utils.makeLabels(clues);

        this.setState({
            grid: grid,
            clues: clues,
            isAcross: true,
            labels: labels,
            activeClue: utils.findFirstActiveClues(true, clues),
            altDirectionActiveClue: utils.findFirstActiveClues(false, clues),
            activeCell: utils.findFirstActiveCells(grid, true, rowLength)[0],
            activeClueCells: utils.findFirstActiveCells(grid, true, rowLength)[1],
            notedCells: [],
            loading: false,
            finished: false
        });
	}

	// save state to local storage
	saveState() {
		localStorage.setItem('createState', JSON.stringify(this.state));
	}

	handleKeyDown(e) {
		console.log(document.activeElement.tagName);
		if (this.state.loading || this.state.loadModalOpen || this.state.saveModalOpen || document.activeElement.tagName === "TEXTAREA") {
			return;
		}

		// ignore meta keys
		if (document.activeElement.tagName === "TEXTAREA" && [32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
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
			this.moveToPrevCell(this.state.isAcross, true);
		}
	}

	enterValidCharacter(key) {
		const wasEmpty = this.state.grid[this.state.activeCell] === null;
		// only assign new value if active cell isnt marked correct

        let newGrid = this.state.grid.slice();
        newGrid[this.state.activeCell] = key.toUpperCase();

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

        this.setState({
            grid: newGrid,
            noteCells: newNoteCells,
        });
        
        if (utils.isGridComplete(newGrid)) {
            return;
        }

		this.moveToNextCell(this.state.isAcross, false, wasEmpty);
	}

	handleCellClick(e, cell) {
        if (this.state.blankMode) {
            this.handleBlankChange(cell);
            if (this.state.activeCell === cell) {
                this.moveToNextCell(this.state.isAcross, false, false);
            }
        } else if (this.state.grid[cell] !== false) {
            // don't make blacked out cell active
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
    
    handleBlankChange(cell) {
        let newGrid = this.state.grid.slice();
        if (this.state.grid[cell] === false) {
            newGrid[cell] = null;
        } else {
            newGrid[cell] = false;
        }
		const newClues = buildCreateClues(newGrid, this.state.rowLength, this.state.clues);
		const newActiveClueCells = utils.findActiveClueCells(this.state.activeCell, this.state.isAcross, newGrid, this.state.rowLength);
        const newLabels = utils.makeLabels(newClues);

        this.setState({
            grid: newGrid,
            clues: newClues,
			labels: newLabels,
			activeClueCells: newActiveClueCells
        })
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

	handleClueInput(e) {
		let newClues = Object.assign({}, this.state.clues);
		const clueNum = e.target.getAttribute("data-clue-num");
		if (clueNum && newClues[clueNum]) {
			newClues[clueNum].clue = e.target.value;
		}
		this.setState({clues: newClues});
	}

	handleClearClick(e) {
		const newGrid = this.state.grid.slice().map(char => char ? null : char);
		this.setState({
			grid: newGrid
		});
    }
    
    handleBlankClick(e) {
        this.setState({blankMode: !this.state.blankMode});
    }

	handleNotesClick(e) {
		this.setState({notesMode: !this.state.notesMode});
	}

	handleSaveClick(e) {
		this.setState({saveModalOpen: true});
	}

	handleModalSaveClick(name) {
		this.setState({
			puzzleName: name,
			loadModalOpen: false,
			saveModalOpen: false
		});
	}

	handleLoadClick(e) {
		this.setState({loadModalOpen: true});
	}

	handleModalClose(e) {
		this.setState({
			saveModalOpen: false,
			loadModalOpen: false
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
			if (!stayOnCell) {
				newGrid[newActiveCell] = null;
			}
		}

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
		});
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
						<PuzzleHeader puzzleName={this.state.puzzleName} handleEditClick={this.handleSaveClick} />
						<ClueBanner 
							mode="create"
							label={Object.keys(this.state.activeClue)[0]}
							clue={this.state.activeClue[Object.keys(this.state.activeClue)[0]]} 
							handleClueInput={this.handleClueInput}/>

					    <Grid
					        grid={this.state.grid}
				     	    rowLength={this.state.rowLength} 
				     	    activeCell={this.state.activeCell}
				     	    activeClueCells={this.state.activeClueCells}
				     	    noteCells={this.state.noteCells}
				     	    handleCellClick={this.handleCellClick}
				     	    labels={this.state.labels} />
		     	    </GridHalfRail>
	     		</GridHalf>
	     		<CluesHalf>
                    <Clues 
                        mode="create"
						clues={this.state.clues}
						grid={this.state.grid}
						activeClue={this.state.activeClue}
						altDirectionActiveClue={this.state.altDirectionActiveClue}
						greyedClues={this.state.greyedClues}
						handleClueClick={this.handleClueClick}
						handleClueInput={this.handleClueInput} />
	     		</CluesHalf>
     		</BodyContainer>);

		return (
			<Fragment>
				<StyledCreate blurred={this.state.saveModalOpen || this.state.loadModalOpen}>
					<NavContainer>
						<NavWrapper
							mode="create"
							toggleSidebarOpen={this.props.toggleSidebarOpen}
							handleClearClick={this.handleClearClick}
							handleBlankClick={this.handleBlankClick}
							handleSaveClick={this.handleSaveClick}
							handleLoadClick={this.handleLoadClick} />
					</NavContainer>
					{body}
				</StyledCreate> 

				{(this.state.saveModalOpen || this.state.loadModalOpen) && 
					<CreateModal 
						saveModalOpen={this.state.saveModalOpen}
						loadModalOpen={this.state.loadModalOpen}
						handleModalClose={this.handleModalClose}
						handleModalSaveClick={this.handleModalSaveClick}
						puzzleName={this.state.puzzleName} />
				}
					
			</Fragment>
		);
	}
}

const StyledCreate = styled.div`
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

export default Create;
