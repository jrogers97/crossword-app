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

const getTextCssClass = (correct, note, isSunday) => "GridCell-text "
	+ (correct ? "correct " : " ") 
	+ (note ? "note " : "")
	+ (isSunday ? "text-sunday " : "");

const GridCell = ({ active, activeClue, correct, incorrect, revealed, note, char, label, isSunday }) => {
	const extraClassName = (active ? "activeCell " : "") 
		+ (activeClue ? "activeClue " : "") 
		+ (char === false ? "disabled " : "");
	return (
		<div className={"GridCell " + extraClassName}>
			<span className={getRedMarkerClass(incorrect, revealed)}></span>
			<span className={"GridCell-label " + (isSunday ? "label-sunday" : "")}> { label } </span>
			<span className={getTextCssClass(correct, note, isSunday)}> { char ? char.toUpperCase() : "" } </span>
		</div>
	);
}

export default GridCell;