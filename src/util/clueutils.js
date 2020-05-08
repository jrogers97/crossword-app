import * as gridUtils from './gridutils';

export const makeClues = (clues, gridNums) => {
	let cluesMap = {};
	["across", "down"].forEach(dir => {
		clues[dir].forEach(clue => {
			const [clueNum, clueText] = splitKeepRemainder(clue, ". ", 1);
			const fullClueNum = clueNum + (dir === "across" ? "A" : "D");

			const startCell = gridNums.indexOf(parseInt(clueNum.replace(/\D+/g, '')));

			cluesMap[fullClueNum] = {
				"startCell": startCell,
				"clue": clueText
					.replace("&amp;", "&")
					.replace("&reg;", "®")
			};
		});
	});

	return cluesMap;
}

export const splitKeepRemainder = (str, separator, limit) => {
	str = str.split(separator);
	if (str.length > limit) {
		var ret = str.splice(0, limit);
		ret.push(str.join(separator));

		return ret;
	}

	return str;
}

export const buildCreateClues = (grid, rowLength, oldClues = {}) => {
	let cluesMap = {};
	let clueLabel = 1;
	grid.forEach((cell, idx) => {
		if (cell !== false) {
			let addedClue = false;
			if (idx % rowLength === 0 || grid[idx - 1] === false) {
				const acrossLabel = `${clueLabel}A`;
				cluesMap[acrossLabel] = {
					startCell: idx,
					clue: oldClues.hasOwnProperty(acrossLabel) ? oldClues[acrossLabel].clue : ""
				};
				addedClue = true;
			}
			if (idx < rowLength || grid[idx - rowLength] === false) {
				const downLabel = `${clueLabel}D`;
				cluesMap[downLabel] = {
					startCell: idx,
					clue: oldClues.hasOwnProperty(downLabel) ? oldClues[downLabel].clue : ""
				};
				addedClue = true;
			}
			if (addedClue) {
				clueLabel++;
			}
		}
	});
	return cluesMap;
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

// cell must be first of the clue
export const getActiveClueFromCell = (cell, clues, isAcross) => {
	const activeClueNum = Object.keys(clues).filter(clueNum => 
		   clues[clueNum].startCell === cell
		&& clueNum[clueNum.length - 1] === (isAcross ? "A" : "D"));

	let newActiveClue = {}
	newActiveClue[activeClueNum] = clues[activeClueNum];

	return newActiveClue;
} 

// if cell was added, check if we should make clue greyed
// if cell was deleted, check if we should un-grey clue
export const getGreyedClues = (newGrid, clues, greyedClues, activeCell, cellAdded, isAcross, rowLength) => {
	const clueCells = gridUtils.findActiveClueCells(activeCell, isAcross, newGrid, rowLength);
	const activeClue = getActiveClueFromCell(clueCells[0], clues, isAcross);
	const activeClueLabel = Object.keys(activeClue)[0];

	const altDirClueCells = gridUtils.findActiveClueCells(activeCell, !isAcross, newGrid, rowLength);
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