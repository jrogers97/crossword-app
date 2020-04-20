import axios from 'axios';

export const fetchRandomData = (ignoredDays) => {
	const ignoredDaysNumbers = ignoredDays.map(day => {
		switch (day) {
			case "sunday": 
				return 0;
			case "monday": 
				return 1;
			case "tuesday": 
				return 2;
			case "wednesday": 
				return 3;
			case "thursday": 
				return 4;
			case "friday": 
				return 5;
			case "saturday": 
				return 6;
			default:
				return 0;
		}
	});

	let [year, month, day] = makeRandomDate(ignoredDaysNumbers);

	return axios.get(`https://raw.githubusercontent.com/doshea/nyt_crosswords/master/${year}/${month}/${day}.json`);
}

export const makeRandomDate = (ignoreDays) => {
	const [minYear, maxYear] = [1979, 2015];
	const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

	const year = Math.floor(Math.random() * (maxYear - minYear)) + minYear;
	const month = Math.floor(Math.random() * 12) + 1;

	let day;
	let validDay = false;
	while (!validDay) {
		day = Math.floor(Math.random() * daysInMonth[month - 1]) + 1;
		let dayOfWeek = (new Date(year, month - 1, day)).getDay();
		validDay = ignoreDays.indexOf(dayOfWeek) === -1;
	}

	// api requires "03" and not "3"
	const [monthStr, dayStr] = [month, day].map(num => num.toString().length !== 2 ? "0" + num : num.toString());

	return [year.toString(), monthStr, dayStr];
}

export const makeFinishedGrid = (grid) => {
	return grid.map(char => char === "." ? false : char.toUpperCase());
}

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
				cluesMap[`${clueLabel}D`] = {
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