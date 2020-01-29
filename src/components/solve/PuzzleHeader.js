import React from 'react';
import './styles/PuzzleHeader.css';

const makePuzzleTitle = (date) => {
	if (!date) {
		return "";
	}

	let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let [month, day, year] = date.split("/");
	let dateObj = new Date(year, month - 1, day);

	let dayStr = days[dateObj.getDay()];
	let dateStr = dateObj.getDate().toString();
	let monthStr = months[dateObj.getMonth()];
	let yearStr = dateObj.getFullYear().toString();

	return [dayStr, `${monthStr} ${dateStr}, ${yearStr}`]
}

const PuzzleHeader = ({date, author}) => {
	let [day, formattedDate] = makePuzzleTitle(date);

	return (
		<p className="PuzzleHeader"> 
			<span className="PuzzleHeader-Day">{ day }</span>
			<span className="PuzzleHeader-Date">{ formattedDate }</span>
			<span className="PuzzleHeader-Author">{ "by " + author }</span>
		</p>
	);
}

export default PuzzleHeader;