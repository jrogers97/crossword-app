// given a cell and isAcross, find all cells in relevant clue
export const findActiveClueCells = (activeCell, isAcross, grid, rowLength) => {
	// console.log(grid, activeCell);
	let activeClueCells = [];

	// find first cell in clue, then continue adding until the end of the clue
	let [firstActiveClueRow, firstActiveClueCol] = activeCell.slice();

	if (isAcross) {
		// first clue cell is either column 0 or when the previous column is blacked out
		while (firstActiveClueCol !== 0 && grid[firstActiveClueRow][firstActiveClueCol - 1] !== false) {
			firstActiveClueCol -= 1;
		}
	} else {
		// first clue cell is either row 0 or when the previous row is blacked out
		while (firstActiveClueRow !== 0 && grid[firstActiveClueRow - 1][firstActiveClueCol] !== false) {
			firstActiveClueRow -= 1;
		}
	}

	activeClueCells.push([firstActiveClueRow, firstActiveClueCol]);

	let [nextClueRowToAdd, nextClueColToAdd] = [firstActiveClueRow, firstActiveClueCol].slice();
	if (isAcross) {
		while (nextClueColToAdd !== rowLength - 1 && grid[nextClueRowToAdd][nextClueColToAdd + 1] !== false) {
			nextClueColToAdd += 1;
			activeClueCells.push([nextClueRowToAdd, nextClueColToAdd].slice());
		}
	} else {
		while (nextClueRowToAdd !== rowLength - 1 && grid[nextClueRowToAdd + 1][nextClueColToAdd] !== false) {
			nextClueRowToAdd += 1;
			activeClueCells.push([nextClueRowToAdd, nextClueColToAdd].slice());
		}
	}

	return activeClueCells;
}

// given a clue, return active cell in that clue, and rest of clue cells
export const getActiveCellsFromClue = (clueObj, grid, rowLength) => {
	let clueNum = Object.keys(clueObj)[0];
	let clue = clueObj[clueNum];
	let isAcross = clueNum[clueNum.length - 1] === "A";
	let activeClueCells = findActiveClueCells(clue.startCell, isAcross, grid, rowLength);

	let i = 0;
	let activeCell = activeClueCells[i].slice();
	let [activeRow, activeCol] = activeCell;
	while (grid[activeRow][activeCol] !== null && i < activeClueCells.length - 1) {
		i++;
		activeCell = activeClueCells[i].slice();
	}

	if (grid[activeRow][activeCol] !== null) {
		activeCell = activeClueCells[0];
	}

	return [activeCell, activeClueCells, isAcross];
}

export const findFirstActiveClues = (isAcross, clues) => {
	let clueNum = `1${isAcross ? "A" : "D"}`;
	if (clues[clueNum]) {
		let ret = {};
		ret[clueNum] = clues[clueNum];
		return ret;
	}

	return null;
}

// returns [first active cell, first active clue cells]
export const findFirstActiveCells = (grid, isAcross, rowLength) => {
	let firstCell = [0,0];
	while (grid[firstCell[0]][firstCell[1]] === false) {
		let endOfRow = firstCell[1] === rowLength - 1;
		if (endOfRow) {
			firstCell = [firstCell[0] + 1, 0];
		} else {
			firstCell = [firstCell[0], firstCell[1] + 1];
		}
	}

	return [firstCell, findActiveClueCells(firstCell, isAcross, grid, grid, rowLength)];
}

// [row, col] is first cell of clue
export const getActiveClueFromCell = ([row, col], clues, isAcross) => {
	let activeClueNum = Object.keys(clues).filter(clueNum => 
		   clues[clueNum].startCell[0] === row 
		&& clues[clueNum].startCell[1] === col
		&& clueNum[clueNum.length - 1] === (isAcross ? "A" : "D"));

	let newActiveClue = {}
	newActiveClue[activeClueNum] = clues[activeClueNum];

	return newActiveClue;
} 

export const getNextDownClueStartCell = (currentClue, clues) => {
	let currentClueLabel = Object.keys(currentClue)[0];
	let clueLabels = Object.keys(clues).filter(clue => clue.includes("D"));
	let clueLabelIdx = clueLabels.indexOf(currentClueLabel);
	// if we're on last clue, return top left cell, otherwise return start cell of next down clue
	if (clueLabelIdx < clueLabels.length - 1) {
		return clues[clueLabels[clueLabelIdx + 1]].startCell;
	} else {
		return [0,0];
	}
}

export const getPreviousDownClueEndCell = (currentClue, clues, grid, rowLength) => {
	let currentClueLabel = Object.keys(currentClue)[0];
	let clueLabels = Object.keys(clues).filter(clue => clue.includes("D"));
	let clueLabelIdx = clueLabels.indexOf(currentClueLabel);

	if (clueLabelIdx === 0) {
		return [0,0];
	} else {
		let previousClueStartCell = clues[clueLabels[clueLabelIdx - 1]].startCell;
		let previousClueCells = findActiveClueCells(previousClueStartCell, false, grid, rowLength);
		return previousClueCells[previousClueCells.length - 1];
	}
}

export const isGridComplete = (grid) => {
	// bool list representing if each row is finished
	let rowsFinished = grid.map(row => {
		return !row.some(char => char === null);
	});

	return rowsFinished.every(row => row);
}

export const findAllCells = (grid, rowLength) => {
	let flatGrid = [];
	grid.forEach((row, idx) => {
		flatGrid = [...flatGrid, ...row];
	});

	let cellPosGrid = flatGrid
		.map((cell, idx) => {
			if (cell === false) {
				return false;
			} else {
				return [Math.floor(idx / rowLength), idx % rowLength];
			}
		})
		.filter(cell => cell !== false);

	return cellPosGrid;
}