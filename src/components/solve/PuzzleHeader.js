import React from 'react';
import styled from 'styled-components';

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
		<StyledPuzzleHeader> 
			<div>
				<PuzzleDay> {day} </PuzzleDay>
				<span> {formattedDate} </span>
			</div>
			<PuzzleAuthor> {"by " + author.replace("&amp;", "&")} </PuzzleAuthor>
		</StyledPuzzleHeader>
	);
}

const StyledPuzzleHeader = styled.div`
	width: 100%;
	margin: 10px 0 14px 0;
	font-size: 20px;
	display: flex;
	align-items: flex-end;
	@media (max-width: 1000px) {
		flex-direction: column;
		align-items: flex-start;
	}
`;

const PuzzleDay = styled.span`
	font-weight: bold;
	margin-right: 8px;
`;

const PuzzleAuthor = styled.span`
	margin-left: auto;
	font-style: italic;
	font-size: 15px;
	max-width: 220px;
	text-align: right;
	@media (max-width: 1000px) {
		text-align: left;
		margin-left: 0;
	}
`;

export default PuzzleHeader;