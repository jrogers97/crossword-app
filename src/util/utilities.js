import {findActiveClueCells, getNextDownClueStartCell, getPreviousDownClueEndCell} from './gridutils';
import {getActiveClueFromCell, getGreyedClues} from './clueutils';

// // given a cell and isAcross, find all cells in relevant clue
// export const findActiveClueCells = (activeCell, isAcross, grid, rowLength) => {
// 	let activeClueCells = [];

// 	// find first cell in clue, then continue adding until the end of the clue
// 	let firstActiveClueCell = activeCell;

// 	if (isAcross) {
// 		// first clue cell is either column 0 or when the previous column is blacked out
// 		while (firstActiveClueCell % rowLength !== 0 && grid[firstActiveClueCell - 1] !== false) {
// 			firstActiveClueCell -= 1;
// 		}
// 	} else {
// 		// first clue cell is either row 0 or when the previous row is blacked out
// 		while (firstActiveClueCell >= rowLength && grid[firstActiveClueCell - rowLength] !== false) {
// 			firstActiveClueCell -= rowLength;
// 		}
// 	}

// 	activeClueCells.push(firstActiveClueCell);

// 	let nextClueCellToAdd = firstActiveClueCell;
// 	if (isAcross) {
// 		while (nextClueCellToAdd % rowLength !== rowLength - 1 && grid[nextClueCellToAdd + 1] !== false) {
// 			nextClueCellToAdd += 1;
// 			activeClueCells.push(nextClueCellToAdd);
// 		}
// 	} else {
// 		while (Math.floor(nextClueCellToAdd / rowLength) < (rowLength - 1) && grid[nextClueCellToAdd + rowLength] !== false) {
// 			nextClueCellToAdd += rowLength;
// 			activeClueCells.push(nextClueCellToAdd);
// 		}
// 	}

// 	return activeClueCells;
// }

// // given a clue, return active cell in that clue, and rest of clue cells, and if the clue is across
// export const getActiveCellsFromClue = (clueObj, grid, rowLength) => {
// 	const clueNum = Object.keys(clueObj)[0];
// 	const clue = clueObj[clueNum];
// 	const isAcross = clueNum[clueNum.length - 1] === "A";
// 	const activeClueCells = findActiveClueCells(clue.startCell, isAcross, grid, rowLength);

// 	let i = 0;
// 	let activeCell = activeClueCells[i];
// 	while (grid[activeCell] !== null && i < activeClueCells.length - 1) {
// 		i++;
// 		activeCell = activeClueCells[i];
// 	}

// 	// if every cell is filled, make first one active
// 	if (grid[activeCell] !== null) {
// 		activeCell = activeClueCells[0];
// 	}

// 	return [activeCell, activeClueCells, isAcross];
// }

// export const findFirstActiveClues = (isAcross, clues) => {
// 	const clueNum = `1${isAcross ? "A" : "D"}`;
// 	if (clues[clueNum]) {
// 		let ret = {};
// 		ret[clueNum] = clues[clueNum];
// 		return ret;
// 	}

// 	return null;
// }

// // returns [first active cell, first active clue cells]
// export const findFirstActiveCells = (grid, isAcross, rowLength) => {
// 	let firstCell = 0;
// 	while (grid[firstCell] === false) {
// 		firstCell += 1;
// 	}

// 	return [firstCell, findActiveClueCells(firstCell, isAcross, grid, rowLength)];
// }

// // cell must be first of the clue
// export const getActiveClueFromCell = (cell, clues, isAcross) => {
// 	const activeClueNum = Object.keys(clues).filter(clueNum => 
// 		   clues[clueNum].startCell === cell
// 		&& clueNum[clueNum.length - 1] === (isAcross ? "A" : "D"));

// 	let newActiveClue = {}
// 	newActiveClue[activeClueNum] = clues[activeClueNum];

// 	return newActiveClue;
// } 

// export const getNextDownClueStartCell = (currentClue, clues) => {
// 	const currentClueLabel = Object.keys(currentClue)[0];
// 	const clueLabels = Object.keys(clues).filter(clue => clue.includes("D"));
// 	const clueLabelIdx = clueLabels.indexOf(currentClueLabel);
// 	// if we're on last clue, return top left cell, otherwise return start cell of next down clue
// 	if (clueLabelIdx < clueLabels.length - 1) {
// 		return clues[clueLabels[clueLabelIdx + 1]].startCell;
// 	} else {
// 		return 0;
// 	}
// }

// export const getPreviousDownClueEndCell = (currentClue, clues, grid, rowLength) => {
// 	const currentClueLabel = Object.keys(currentClue)[0];
// 	const clueLabels = Object.keys(clues).filter(clue => clue.includes("D"));
// 	const clueLabelIdx = clueLabels.indexOf(currentClueLabel);

// 	if (clueLabelIdx === 0) {
// 		return 0;
// 	} else {
// 		const previousClueStartCell = clues[clueLabels[clueLabelIdx - 1]].startCell;
// 		const previousClueCells = findActiveClueCells(previousClueStartCell, false, grid, rowLength);
// 		return previousClueCells[previousClueCells.length - 1];
// 	}
// }

// // if cell was added, check if we should make clue greyed
// // if cell was deleted, check if we should un-grey clue
// export const getGreyedClues = (newGrid, clues, greyedClues, activeCell, cellAdded, isAcross, rowLength) => {
// 	const clueCells = findActiveClueCells(activeCell, isAcross, newGrid, rowLength);
// 	const activeClue = getActiveClueFromCell(clueCells[0], clues, isAcross);
// 	const activeClueLabel = Object.keys(activeClue)[0];

// 	const altDirClueCells = findActiveClueCells(activeCell, !isAcross, newGrid, rowLength);
// 	const altDirActiveClue = getActiveClueFromCell(altDirClueCells[0], clues, !isAcross);
// 	const altDirActiveClueLabel = Object.keys(altDirActiveClue)[0];

// 	let greyedCluesCopy = greyedClues.slice();

// 	const clueInfo = [[clueCells, activeClueLabel], [altDirClueCells, altDirActiveClueLabel]];
// 	clueInfo.forEach(([cells, label]) => {
// 		let shouldGreyClue = !cells.some(cell => newGrid[cell] === null);
// 		let clueIdx = greyedCluesCopy.indexOf(label);
// 		if (cellAdded && shouldGreyClue && clueIdx < 0) {
// 			greyedCluesCopy = [...greyedCluesCopy, label];
// 		} else if (!cellAdded && clueIdx >= 0) {
// 			greyedCluesCopy.splice(clueIdx, 1);
// 		}
// 	});

// 	return greyedCluesCopy;
// }

// export const isGridComplete = (grid) => !grid.some(char => char === null);

// export const findAllCells = (grid) => {
// 	return grid
// 		.map((cell, idx) => (cell === false) ? false : idx)
// 	    .filter(cell => cell !== false);
// }

// // returns [starting cell, clue number label]
// export const makeLabels = (clues) => {
// 	return Object.keys(clues).map(clueNum => [clues[clueNum].startCell, clueNum.replace(/\D+/g, '')]);
// }

// for state arrays like correct, revealed, noted cells
export const isCellInGroup = (cellGroup, cellToFind) => !!cellGroup.find(cell => cellToFind === cell);

export const removeArrayItem = (array, item) => {
	const idx = array.indexOf(item);
	if (idx > -1) {
		array.splice(idx, 1);
	}
}

// // return false if any squares have more than one letter
// export const isRebus = (grid) => grid.some(square => square.length > 1);

export const formatTime = (seconds) => {
	let substringStart;
	if (seconds < 600) {
		substringStart = 15;
	} else if (seconds < 3600) {
		substringStart = 14;
	} else if (seconds < 36000) {
		substringStart = 12;
	} else {
		substringStart = 11;
	}

	return new Date(seconds * 1000).toISOString().substr(substringStart, 19 - substringStart);
}

export const formatDate = (date) => {
	return `${date.getMonth()}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`
}

export const getNextCellState = (
	grid, 
	clues, 
	activeCell, 
	rowLength, 
	isAcross, 
	ignoreUnfinishedClues, 
	wasEmptyCell
) => {
	let currentCell = activeCell;
	let foundNextCell = false;

	// find next closest empty cell
	while (!foundNextCell) {
		let activeClueCells = findActiveClueCells(currentCell, isAcross, grid, rowLength);
		let endOfClue = activeClueCells[activeClueCells.length - 1] === currentCell;
			
		let unfinishedClue = false;
		if (endOfClue && !ignoreUnfinishedClues) {
			unfinishedClue = activeClueCells.some(cell => {
				return grid[cell] === null 
					&& activeCell !== cell ;
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
			let activeClue = getActiveClueFromCell(clueStartCell, clues, isAcross);
			// let endOfClue = currentCell === activeClueCells[activeClueCells.length - 1];

			if (endOfClue) {
				currentCell = getNextDownClueStartCell(activeClue, clues);
			} else {
				currentCell += rowLength;
			}
		}

		// return to first cell if we're at the last cell
		if (Math.floor(currentCell / rowLength) > rowLength - 1 
			|| currentCell % rowLength > rowLength - 1) {
			currentCell = 0;
		}

		// if previously filled cell was empty, don't stop until we find next empty cell
		// if it had value, stop at next valid cell we find, even if it had a value
		foundNextCell = wasEmptyCell 
			? (grid[currentCell] === null) 
			: (grid[currentCell] !== false);
	}

	const startOfClue = findActiveClueCells(currentCell, isAcross, grid, rowLength)[0];
	const startOfAltDirClue = findActiveClueCells(currentCell, !isAcross, grid, rowLength)[0];

	return {
		activeCell: currentCell,
		activeClueCells: findActiveClueCells(currentCell, isAcross, grid, rowLength),
		activeClue: getActiveClueFromCell(startOfClue, clues, isAcross),
		altDirectionActiveClue: getActiveClueFromCell(startOfAltDirClue, clues, !isAcross)
	}
}

export const getPrevCellState = (
	grid, 
	clues, 
	activeCell, 
	rowLength, 
	activeClueCells,
	correctCells,
	incorrectCells, 
	greyedClues,
	isAcross, 
	shouldDelete
) => {
	let currentCell = activeCell;
	let foundNextCell = false;

	while (!foundNextCell) {
		let activeClueCells = findActiveClueCells(currentCell, isAcross, grid, rowLength);

		if (isAcross) {
			currentCell -= 1;
		} else {
			let clueStartCell = activeClueCells[0];
			let activeClue = getActiveClueFromCell(clueStartCell, clues, isAcross);
			let startOfClue = activeClueCells[0] === currentCell;

			if (startOfClue) {
				currentCell = getPreviousDownClueEndCell(activeClue, clues, grid, rowLength);
			} else {
				currentCell -= rowLength;
			}
		}
			
		// don't do anything if we're at first cell
		if (currentCell < 0) {
			return;
		}

		foundNextCell = grid[currentCell] !== false;
	}

	const newActiveCell = currentCell;

	// TODO: DELETE WHEN CELL 0

	const stayOnCell = grid[activeCell] !== null && shouldDelete;
	let newGrid = grid.slice();
	let filteredIncorrectCells = null;

	// delete active cell value, and previous cell value if the active cell is empty
	if (shouldDelete) {
		newGrid[activeCell] = null;
		if (!stayOnCell && (!correctCells || !isCellInGroup(correctCells, newActiveCell))) {
			newGrid[newActiveCell] = null;
		}

		if (incorrectCells) {
			filteredIncorrectCells = incorrectCells.filter(cell => {
				// return activeCell !== cell && (!prevCell || prevCell !== cell);
				return activeCell !== cell && (stayOnCell || newActiveCell !== cell);
			});
		}
	}

	const newGreyedClues = greyedClues ? getGreyedClues(newGrid, clues, greyedClues, stayOnCell ? activeCell : newActiveCell, 
		false, isAcross, rowLength) : null;

	// use different cell to find active clue depending on if we moved or stayed cells
	const newClueCell = stayOnCell ? activeCell : newActiveCell;
	const startOfClue = findActiveClueCells(newClueCell, isAcross, grid, rowLength)[0];
	const startOfAltDirClue = findActiveClueCells(newClueCell, !isAcross, grid, rowLength)[0];

	// if active cell had value, stay there. otherwise, move to previous cell
	let newState = {
		grid: newGrid,
		activeCell: stayOnCell ? activeCell : newActiveCell,
		activeClueCells: stayOnCell ? activeClueCells : findActiveClueCells(newActiveCell, isAcross, grid, rowLength),
		activeClue: getActiveClueFromCell(startOfClue, clues, isAcross),
		altDirectionActiveClue: getActiveClueFromCell(startOfAltDirClue, clues, !isAcross),
	};
	if (newGreyedClues) {
		newState["greyedClues"] = newGreyedClues;
	}
	if (filteredIncorrectCells) {
		newState["incorrectCells"] = filteredIncorrectCells;
	}
	return newState;
}