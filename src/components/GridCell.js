import React from 'react';
import './styles/GridCell.css';

const getRedMarkerClass = (incorrect, revealed) => {
	if (revealed) {
		return "GridCell-revealed";
	} else if (incorrect) {
		return "GridCell-diag";
	} else {
		return "hidden";
	}
}

const getTextCssClass = (correct, note) => "GridCell-text " + (correct ? "correct " : " ") + (note ? "note" : "");

const GridCell = ({ active, activeClue, correct, incorrect, revealed, note, char, label }) => {
	const extraClassName = (active ? "activeCell " : "") + (activeClue ? "activeClue " : "") + (char === false ? "disabled " : "");
	return (
		<div className={"GridCell " + extraClassName}>
			<span className={getRedMarkerClass(incorrect, revealed)}></span>
			<span className="GridCell-label"> { label } </span>
			<span className={getTextCssClass(correct, note)}> { char ? char.toUpperCase() : "" } </span>
		</div>
	);
}

export default GridCell;