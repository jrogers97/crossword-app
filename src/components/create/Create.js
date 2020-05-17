import React, { Component, Fragment } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import ClipLoader from 'react-spinners/ClipLoader';
import styled from 'styled-components';
import * as utils from '../../util/utilities';
import * as gridUtils from '../../util/gridutils';
import * as clueUtils from '../../util/clueutils';

import {NavWrapper} from '../common/NavWrapper';
import Grid from '../common/grid/Grid';
import Clues from '../common/clues/Clues';
import ClueBanner from '../common/clues/ClueBanner';
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
            isAcross: true,
			blankMode: false,
			blankModeType: "regular",
			labels: [],
			loading: true,
			finished: false,
			openModalType: "",
			puzzleName: null,
			puzzleSaved: false,
			dateCreated: "",
			savedPuzzles: {}
        }
		
		this.setupNewPuzzle = this.setupNewPuzzle.bind(this);
		this.handleCellClick = this.handleCellClick.bind(this);
		this.handleCluesClearClick = this.handleCluesClearClick.bind(this);
		this.handleClueClick = this.handleClueClick.bind(this);
		this.handleClueInput = this.handleClueInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleBlankClick = this.handleBlankClick.bind(this);
        this.handleBlankTypeClick = this.handleBlankTypeClick.bind(this);
		this.handleSaveClick = this.handleSaveClick.bind(this);
		this.handleLoadClick = this.handleLoadClick.bind(this);
		this.handlePrintClick = this.handlePrintClick.bind(this);
		this.handleHelpClick = this.handleHelpClick.bind(this);
		this.handlePuzzleDeleteClick = this.handlePuzzleDeleteClick.bind(this);
		this.handleGridSizeChange = this.handleGridSizeChange.bind(this);
		this.savePuzzle = this.savePuzzle.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
	}

	componentDidMount() {
        var self = this;
        this.props.changeActivePage("create");
		this.timeout = setTimeout(function() {
			const createState = JSON.parse(localStorage.getItem('createState'));
			if (createState) {
				console.log(createState);
				delete createState.blankMode;
				self.setState(createState);
			} else {
				self.setupNewPuzzle()
			}
			self.setState({
				savedPuzzles: JSON.parse(localStorage.getItem('savedPuzzles')) || {}
			});
		}, 400);

		document.addEventListener("keydown", this.handleKeyDown);
		smoothscroll.polyfill();
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);
	}

	setupNewPuzzle() {
		this.setState({loading: true}, () => {
			setTimeout(() => {
				const rowLength = this.state.rowLength;
				const grid = new Array(rowLength * rowLength).fill(null);
				const clues = clueUtils.buildCreateClues(grid, rowLength);
				const labels = gridUtils.makeLabels(clues);
	
				this.setState({
					grid: grid,
					clues: clues,
					isAcross: true,
					labels: labels,
					activeClue: clueUtils.findFirstActiveClues(true, clues),
					altDirectionActiveClue: clueUtils.findFirstActiveClues(false, clues),
					activeCell: gridUtils.findFirstActiveCells(grid, true, rowLength)[0],
					activeClueCells: gridUtils.findFirstActiveCells(grid, true, rowLength)[1],
					loading: false,
					finished: false,
					puzzleName: null,
					puzzleSaved: false,
					dateCreated: utils.formatDate(new Date())
				});
			}, 100);
		});
	}

	// save state to local storage
	savePuzzle(name, oldName) {
		this.setState({
			puzzleName: name,
			puzzleSaved: true,
			openModalType: ""
		}, () => {
			let stateCopy = Object.assign({}, this.state);
			// saved puzzles is tracked outside of individual puzzle's state
			delete stateCopy["savedPuzzles"];
			localStorage.setItem('createState', JSON.stringify(stateCopy));

			let newSavedPuzzles = Object.assign({}, this.state.savedPuzzles);
			// if puzzle is already saved under a different name, delete that version
			if (oldName && this.state.savedPuzzles[oldName]) {
				delete newSavedPuzzles[oldName];
			}
			// store puzzle state in object and set in local storage/state
			newSavedPuzzles[name] = stateCopy;
			this.refreshSavedPuzzles(newSavedPuzzles);
		});
	}

	refreshSavedPuzzles(puzzles) {
		localStorage.setItem('savedPuzzles', JSON.stringify(puzzles));
		this.setState({savedPuzzles: puzzles});
	}

	loadPuzzle(name) {
		this.setState({
			loading: true,
			openModalType: ""
		}, () => {
			setTimeout(() => {
				const loadedPuzzle = this.state.savedPuzzles[name];
				if (loadedPuzzle) {
					localStorage.setItem('createState', JSON.stringify(loadedPuzzle));
					this.setState(loadedPuzzle);
				}
			}, 200);
		});
	}

	handleKeyDown(e) {
		// ignore loading, modal open, clue input
		if (this.state.loading || this.state.openModalType !== "" || document.activeElement.tagName === "TEXTAREA") {
			return;
		}

		// ignore meta keys 
		if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
	    }

		// valid characters
		if (e.keyCode >= 65 && e.keyCode <= 90) {
			this.enterValidCharacter(e.key);
		}

		if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
			// get possible new active clue/cells
			const activeClueCellsAcross = gridUtils.findActiveClueCells(this.state.activeCell, true, this.state.grid, this.state.rowLength);
			const activeClueCellsDown = gridUtils.findActiveClueCells(this.state.activeCell, false, this.state.grid, this.state.rowLength);
			const activeClueAcross = clueUtils.getActiveClueFromCell(activeClueCellsAcross[0], this.state.clues, true);
			const activeClueDown = clueUtils.getActiveClueFromCell(activeClueCellsDown[0], this.state.clues, false);

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

        this.setState({
            grid: newGrid,
			puzzleSaved: false
        });
        
        if (gridUtils.isGridComplete(newGrid)) {
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

			const activeClueCells = gridUtils.findActiveClueCells(cell, isAcross, this.state.grid, this.state.rowLength);
			const altDirActiveClueCells = gridUtils.findActiveClueCells(cell, !isAcross, this.state.grid, this.state.rowLength);
			const activeClue = clueUtils.getActiveClueFromCell(activeClueCells[0], this.state.clues, isAcross);
			const altDirectionActiveClue = clueUtils.getActiveClueFromCell(altDirActiveClueCells[0], this.state.clues, !isAcross);

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
		const symmetricCell = this.state.blankModeType === "mirrored" ? this.state.grid.length - 1 - cell : null;
		
        if (this.state.grid[cell] === false) {
			newGrid[cell] = null;
			if (symmetricCell !== null) {
				newGrid[symmetricCell] = null;
			}
        } else {
			newGrid[cell] = false;
			if (symmetricCell !== null) {
				newGrid[symmetricCell] = false;
			}
		}
		
		const newClues = clueUtils.buildCreateClues(newGrid, this.state.rowLength, this.state.clues);
		const newActiveClueCells = gridUtils.findActiveClueCells(this.state.activeCell, this.state.isAcross, newGrid, this.state.rowLength);
        const newLabels = gridUtils.makeLabels(newClues);

        this.setState({
            grid: newGrid,
            clues: newClues,
			labels: newLabels,
			activeClueCells: newActiveClueCells,
			puzzleSaved: false
        })
    }

	handleClueClick(e, clueNum) {
		let newActiveClue = {};
		newActiveClue[clueNum] = this.state.clues[clueNum];

		const {activeCell, activeClueCells, isAcross} = gridUtils.getActiveCellsFromClue(newActiveClue, this.state.grid, this.state.rowLength);

		const altDirClueFirstCell = gridUtils.findActiveClueCells(activeCell, !isAcross, this.state.grid, this.state.rowLength)[0];
		const altDirectionActiveClue = clueUtils.getActiveClueFromCell(altDirClueFirstCell, this.state.clues, !isAcross);

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
		this.setState({
			clues: newClues,
			puzzleSaved: false
		});
	}

	handleCluesClearClick(label) {
		const clueType = label[0].toLowerCase();
		let newClues = Object.assign({}, this.state.clues);
		Object.keys(newClues).forEach((clue) => {
			if (clue.toLowerCase().indexOf(clueType) > 0) {
				newClues[clue].clue = "";
			}
		});
		this.setState({
			clues: newClues, 
			puzzleSaved: false
		});
    }
    
    handleBlankClick(e) {
        this.setState({blankMode: !this.state.blankMode});
	}
	
	handleBlankTypeClick(type) {
		this.setState({blankModeType: type});
	}

	handleSaveClick(name, shouldEdit) {
		// edit puzzle name
		if (shouldEdit) {
			this.setState({openModalType: "save"});
			return;
		}

		if (name != null) {
			// just made/changed name
			this.savePuzzle(name, this.state.puzzleName);
		} else if (this.state.puzzleName != null) {
			// already have name
			this.savePuzzle(this.state.puzzleName);
		} else {
			// dont have name yet
			this.setState({openModalType: "save"});
		}
	}

	handleLoadClick(name, shouldClose = false) {
		if (shouldClose) {
			this.setState({openModalType: ""});
		} else if (name != null) {
			this.loadPuzzle(name);
		} else {
			this.setState({openModalType: "load"});
		}
	}

	handlePuzzleDeleteClick(name) {
		let newSavedPuzzles = Object.assign({}, this.state.savedPuzzles);
		delete newSavedPuzzles[name];
		if (!Object.keys(newSavedPuzzles).some(key => key !== this.state.puzzleName)) {
			this.setState({openModalType: ""}, () => {
				this.refreshSavedPuzzles(newSavedPuzzles);
			});
		} else {
			this.refreshSavedPuzzles(newSavedPuzzles);
		}
	}

	handlePrintClick() {
		this.setState({openModalType: "print"});
	}

	handleHelpClick() {
		this.setState({openModalType: "help"});
	}

	handleModalClose() {
		this.setState({openModalType: ""});
	}

	handleGridSizeChange(e) {
		const newRowLength = Number(e.target.value);
		const newGrid = gridUtils.resizeGrid(newRowLength, this.state.rowLength, this.state.grid);
		const newClues = clueUtils.buildCreateClues(newGrid, newRowLength, this.state.clues);
		this.setState({
			rowLength: newRowLength,
			grid: newGrid,
			clues: newClues,
			labels: gridUtils.makeLabels(newClues),
			activeCell: gridUtils.findFirstActiveCells(newGrid, this.state.isAcross, newRowLength)[0],
			activeClueCells: gridUtils.findFirstActiveCells(newGrid, this.state.isAcross, newRowLength)[1],
			activeClue: clueUtils.findFirstActiveClues(true, newClues),
			altDirectionActiveClue: clueUtils.findFirstActiveClues(false, newClues),
			puzzleSaved: false
		});
	}

	moveToNextCell(isAcross, ignoreUnfinishedClues, wasEmptyCell) {
		const nextCellState = utils.getNextCellState(
			this.state.grid,
			this.state.clues,
			this.state.activeCell,
			this.state.rowLength,
			isAcross, 
			ignoreUnfinishedClues, 
			wasEmptyCell
		);
		this.setState(nextCellState);
	}

	moveToPrevCell(isAcross, shouldDelete) {
		const prevCellState = utils.getPrevCellState(
			this.state.grid,
			this.state.clues,
			this.state.activeCell,
			this.state.rowLength,
			this.state.activeClueCells,
			null,
			null,
			null,
			isAcross,
			shouldDelete,
		);
		this.setState(prevCellState);
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
						<PuzzleHeader 
							puzzleName={this.state.puzzleName} 
							gridSize={this.state.rowLength}
							handleEditClick={this.handleSaveClick}
							handleGridSizeChange={this.handleGridSizeChange} />
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
						handleClearClick={this.handleCluesClearClick}
						handleClueClick={this.handleClueClick}
						handleClueInput={this.handleClueInput} />
	     		</CluesHalf>
     		</BodyContainer>);

		return (
			<Fragment>
				<StyledCreate blurred={this.state.openModalType !== ""}>
					<NavContainer>
						<NavWrapper
							mode="create"
							blankMode={this.state.blankMode}
							blankModeType={this.state.blankModeType}
							puzzleSaved={this.state.puzzleSaved}
							puzzleName={this.state.puzzleName}
							savedPuzzles={this.state.savedPuzzles}
							toggleSidebarOpen={this.props.toggleSidebarOpen}
							handleBlankClick={this.handleBlankClick}
							handleEraserTypeClick={this.handleBlankTypeClick}
							handleSaveClick={this.handleSaveClick}
							handleLoadClick={this.handleLoadClick} 
							handlePrintClick={this.handlePrintClick}
							handleHelpClick={this.handleHelpClick}
							handleNewClick={this.setupNewPuzzle} />
					</NavContainer>
					{body}
				</StyledCreate> 

				{(this.state.openModalType !== "") && 
					<CreateModal 
						grid={this.state.grid}
						rowLength={this.state.rowLength}
						labels={this.state.labels}
						clues={this.state.clues}
						savedPuzzles={this.state.savedPuzzles}
						openModalType={this.state.openModalType}
						handleModalClose={this.handleModalClose}
						handleSaveClick={this.handleSaveClick}
						handleLoadClick={this.handleLoadClick}
						handlePuzzleDeleteClick={this.handlePuzzleDeleteClick}
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
