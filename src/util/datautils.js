import axios from 'axios';

export const fetchRandomData = (ignoredDays) => {
	const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	const ignoredDaysNumbers = ignoredDays.map(day => days.indexOf(day));

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
