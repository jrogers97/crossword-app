import React from 'react';
import './styles/PuzzleHeader.css';

const makePuzzleTitle = (date) => {
	if (!date) {
		return "";
	}

	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const [month, day, year] = date.split("/");
	const dateObj = new Date(year, month - 1, day);

	const dayStr = days[dateObj.getDay()];
	const dateStr = dateObj.getDate().toString();
	const monthStr = months[dateObj.getMonth()];
	const yearStr = dateObj.getFullYear().toString();

	return [dayStr, `${monthStr} ${dateStr}, ${yearStr}`]
}

const PuzzleHeader = ({date, author}) => {
	const [day, formattedDate] = makePuzzleTitle(date);

	return (
		<div className="PuzzleHeader"> 
			<div className="PuzzleHeader-DateWrapper">
				<span className="PuzzleHeader-Day">{ day }</span>
				<span className="PuzzleHeader-Date">{ formattedDate }</span>
			</div>
			<span className="PuzzleHeader-Author">{ "by " + author }</span>
		</div>
	);
}

export default PuzzleHeader;