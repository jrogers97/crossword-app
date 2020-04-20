import React from 'react';
import styled, {css} from 'styled-components';
// import './styles/GridCell.css';

const GridCell = React.memo(({ active, activeClue, correct, incorrect, revealed, note, char, label, isSunday }) => {
	return (
		<StyledGridCell
			active={active}
			activeClue={activeClue}
			disabled={char === false}>

			<SpecialCellMarker
				revealed={revealed}
				incorrect={incorrect}>
			</SpecialCellMarker>

			<GridCellLabel isSunday={isSunday}> 
				{label} 
			</GridCellLabel>

			<GridCellText
				correct={correct}
				note={note}
				isSunday={isSunday}> 
				{char ? char.toUpperCase() : ""}
			</GridCellText>
		</StyledGridCell>
	);
})

const StyledGridCell = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${props => {
		if (props.disabled) {
			return "#000000";
		} else if (props.active) {
			return "#ffda00";
		} else if (props.activeClue) {
			return "#a7d8ff";
		} else {
			return "initial";
		}
	}}
`;

const SpecialCellMarker = styled.span`
	position: absolute;
	display: ${props => (props.revealed || props.incorrect) ? "block" : "none"};
	${props => props.revealed && 
		css`
			height: 0;
			width: 0;
			top: 0;
			left: 21px;
			border-top: 5px solid #E63333;
			border-right: 5px solid #E63333;
			border-bottom: 5px solid transparent;
			border-left: 5px solid transparent;
		`};
	${props => props.incorrect &&
		css`
			height: 2px;
			width: 45px;
			top: 14px;
			left: -7px;
			background-color: #E63333;
			transform: rotate(-45deg)
		`};
	@media (max-width: 1000px) {
		width: ${props => props.revealed ? "" : "37px"};
		left: ${props => props.revealed ? "16px" : "-5px"};
		top: ${props => props.revealed ? "" : "12px"};
	}
	@media (max-width: 650px) {
		width: ${props => props.revealed ? "" : "32px"};
		left: ${props => props.revealed ? "13px" : "-5px"};
		top: ${props => props.revealed ? "" : "11px"};
	}
`;

const GridCellLabel = styled.span`
	font-size: ${props => props.isSunday ? "11px" : "12px"};
	position: absolute;
	top: 0;
	left: ${props => props.isSunday ? "0" : "0.5px"};
	line-height: ${props => props.isSunday ? "11px" : "14px"};
	letter-spacing: -1px;
	@media (max-width: 1000px) {
		font-size: ${props => props.isSunday ? "9px" : "10px"};
		line-height: ${props => props.isSunday ? "9px" : "10px"};
		top: 0;
		left: 0;
	}
	@media (max-width: 650px) {
		font-size: 9px;
		line-height: 9px;
		top: 0;
		left: 0;
	}
`;

const GridCellText = styled.span`
	vertical-align: middle;
	text-align: center;
	font-weight: 600;
	padding-top: 7px;
	font-size: ${props => props.isSunday ? "15px" : "20px"};
	color: ${props => {
		if (props.correct) {
			return "#2860D8";
		} else if (props.note) {
			return "#909090";
		} else {
			return "initial";
		}
	}};
	@media (max-width: 1000px) {
		font-size: ${props => props.isSunday ? "14px" : "18px"};
	}
	@media (max-width: 650px) {
		font-size: ${props => props.isSunday ? "13px" : "15px"};
	}
`;

export default GridCell;