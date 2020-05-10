import {findActiveClueCells, getNextDownClueStartCell, getPreviousDownClueEndCell} from './gridutils';
import {getActiveClueFromCell, getGreyedClues} from './clueutils';

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
			currentCell = 0;
		}

		foundNextCell = grid[currentCell] !== false || currentCell === 0;
	}

	const newActiveCell = currentCell;

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