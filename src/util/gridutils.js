export const makeFinishedGrid = (grid) => {
	return grid.map(char => char === "." ? false : char.toUpperCase());
}

export const resizeGrid = (newRowLength, oldRowLength, grid) => {
	const delta = newRowLength - oldRowLength;
	let newGrid = [];
	// go row by row and add/delete items as necessary
	for (let i=0; i < oldRowLength * oldRowLength; i += oldRowLength) {
		const oldRow = grid.slice(i, i + oldRowLength);
		const newRow = (delta > 0) ? oldRow.concat(Array(delta).fill(null)) : oldRow.slice(0, oldRowLength + delta);
		newGrid = newGrid.concat(newRow);
	}
	return (delta > 0) ? newGrid.concat(Array(newRowLength * delta).fill(null)) : newGrid.slice(0, newRowLength * newRowLength);
}	

export const resizeActiveCell = (newRowLength, oldRowLength, oldActiveCell) => {
	const oldActiveRow = Math.floor(oldActiveCell / oldRowLength);
	const oldActiveCol = oldActiveCell % oldRowLength;
	return (oldActiveRow * newRowLength) + oldActiveCol;
}

// given a cell, find all cells in relevant clue
export const findActiveClueCells = (activeCell, isAcross, grid, rowLength) => {
	let activeClueCells = [];

	// find first cell in clue, then continue adding until the end of the clue
	let firstActiveClueCell = activeCell;

	if (isAcross) {
		// first clue cell is either column 0 or when the previous column is blacked out
		while (firstActiveClueCell % rowLength !== 0 && grid[firstActiveClueCell - 1] !== false) {
			firstActiveClueCell -= 1;
		}
	} else {
		// first clue cell is either row 0 or when the previous row is blacked out
		while (firstActiveClueCell >= rowLength && grid[firstActiveClueCell - rowLength] !== false) {
			firstActiveClueCell -= rowLength;
		}
	}

	activeClueCells.push(firstActiveClueCell);

	let nextClueCellToAdd = firstActiveClueCell;
	if (isAcross) {
		while (nextClueCellToAdd % rowLength !== rowLength - 1 && grid[nextClueCellToAdd + 1] !== false) {
			nextClueCellToAdd += 1;
			activeClueCells.push(nextClueCellToAdd);
		}
	} else {
		while (Math.floor(nextClueCellToAdd / rowLength) < (rowLength - 1) && grid[nextClueCellToAdd + rowLength] !== false) {
			nextClueCellToAdd += rowLength;
			activeClueCells.push(nextClueCellToAdd);
		}
	}

	return activeClueCells;
}

// given a clue, return active cell in that clue, and rest of clue cells, and if the clue is across
export const getActiveCellsFromClue = (clueObj, grid, rowLength) => {
	const clueNum = Object.keys(clueObj)[0];
	const clue = clueObj[clueNum];
	const isAcross = clueNum[clueNum.length - 1] === "A";
	const activeClueCells = findActiveClueCells(clue.startCell, isAcross, grid, rowLength);

	let i = 0;
	let activeCell = activeClueCells[i];
	while (grid[activeCell] !== null && i < activeClueCells.length - 1) {
		i++;
		activeCell = activeClueCells[i];
	}

	// if every cell is filled, make first one active
	if (grid[activeCell] !== null) {
		activeCell = activeClueCells[0];
	}

	// return [activeCell, activeClueCells, isAcross];
	return {activeCell, activeClueCells, isAcross};
}

// returns [first active cell, first active clue cells]
export const findFirstActiveCells = (grid, isAcross, rowLength) => {
	let firstCell = 0;
	while (grid[firstCell] === false) {
		firstCell += 1;
	}

	return [firstCell, findActiveClueCells(firstCell, isAcross, grid, rowLength)];
}

export const getNextDownClueStartCell = (currentClue, clues) => {
	const currentClueLabel = Object.keys(currentClue)[0];
	const clueLabels = Object.keys(clues).filter(clue => clue.includes("D"));
	const clueLabelIdx = clueLabels.indexOf(currentClueLabel);
	// if we're on last clue, return top left cell, otherwise return start cell of next down clue
	if (clueLabelIdx < clueLabels.length - 1) {
		return clues[clueLabels[clueLabelIdx + 1]].startCell;
	} else {
		return 0;
	}
}

export const getPreviousDownClueEndCell = (currentClue, clues, grid, rowLength) => {
	const currentClueLabel = Object.keys(currentClue)[0];
	const clueLabels = Object.keys(clues).filter(clue => clue.includes("D"));
	const clueLabelIdx = clueLabels.indexOf(currentClueLabel);

	if (clueLabelIdx === 0) {
		return 0;
	} else {
		const previousClueStartCell = clues[clueLabels[clueLabelIdx - 1]].startCell;
		const previousClueCells = findActiveClueCells(previousClueStartCell, false, grid, rowLength);
		return previousClueCells[previousClueCells.length - 1];
	}
}

// returns [starting cell, clue number label]
export const makeLabels = (clues) => {
	return Object.keys(clues).map(clueNum => [clues[clueNum].startCell, clueNum.replace(/\D+/g, '')]);
}

// return false if any squares have more than one letter
export const isRebus = (grid) => grid.some(square => square.length > 1);

export const isGridComplete = (grid) => !grid.some(char => char === null);

export const findAllCells = (grid) => {
	return grid
		.map((cell, idx) => (cell === false) ? false : idx)
	    .filter(cell => cell !== false);
}