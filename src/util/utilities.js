// given a cell and isAcross, find all cells in relevant clue
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

	return [activeCell, activeClueCells, isAcross];
}

export const findFirstActiveClues = (isAcross, clues) => {
	const clueNum = `1${isAcross ? "A" : "D"}`;
	if (clues[clueNum]) {
		let ret = {};
		ret[clueNum] = clues[clueNum];
		return ret;
	}

	return null;
}

// returns [first active cell, first active clue cells]
export const findFirstActiveCells = (grid, isAcross, rowLength) => {
	let firstCell = 0;
	while (grid[firstCell] === false) {
		firstCell += 1;
	}

	return [firstCell, findActiveClueCells(firstCell, isAcross, grid, rowLength)];
}

// cell must be first of the clue
export const getActiveClueFromCell = (cell, clues, isAcross) => {
	const activeClueNum = Object.keys(clues).filter(clueNum => 
		   clues[clueNum].startCell === cell
		&& clueNum[clueNum.length - 1] === (isAcross ? "A" : "D"));

	let newActiveClue = {}
	newActiveClue[activeClueNum] = clues[activeClueNum];

	return newActiveClue;
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

// if cell was added, check if we should make clue greyed
// if cell was deleted, check if we should un-grey clue
export const getGreyedClues = (newGrid, clues, greyedClues, activeCell, cellAdded, isAcross, rowLength) => {
	const clueCells = findActiveClueCells(activeCell, isAcross, newGrid, rowLength);
	const activeClue = getActiveClueFromCell(clueCells[0], clues, isAcross);
	const activeClueLabel = Object.keys(activeClue)[0];

	const altDirClueCells = findActiveClueCells(activeCell, !isAcross, newGrid, rowLength);
	const altDirActiveClue = getActiveClueFromCell(altDirClueCells[0], clues, !isAcross);
	const altDirActiveClueLabel = Object.keys(altDirActiveClue)[0];

	let greyedCluesCopy = greyedClues.slice();

	const clueInfo = [[clueCells, activeClueLabel], [altDirClueCells, altDirActiveClueLabel]];
	clueInfo.forEach(([cells, label]) => {
		let shouldGreyClue = !cells.some(cell => newGrid[cell] === null);
		let clueIdx = greyedCluesCopy.indexOf(label);
		if (cellAdded && shouldGreyClue && clueIdx < 0) {
			greyedCluesCopy = [...greyedCluesCopy, label];
		} else if (!cellAdded && clueIdx >= 0) {
			greyedCluesCopy.splice(clueIdx, 1);
		}
	});

	return greyedCluesCopy;
}

export const isGridComplete = (grid) => !grid.some(char => char === null);

export const findAllCells = (grid) => {
	return grid
		.map((cell, idx) => (cell === false) ? false : idx)
	    .filter(cell => cell !== false);
}

// returns [starting cell, clue number label]
export const makeLabels = (clues) => {
	return Object.keys(clues).map(clueNum => [clues[clueNum].startCell, clueNum.replace(/\D+/g, '')]);
}

// for state arrays like correct, revealed, noted cells
export const isCellInGroup = (cellGroup, cellToFind) => !!cellGroup.find(cell => cellToFind === cell);

// return false if any squares have more than one letter
export const isRebus = (grid) => grid.some(square => square.length > 1);

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