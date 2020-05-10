import React from 'react';
import styled, {css} from 'styled-components';

const GridCell = React.memo(({ active, activeClue, correct, incorrect, revealed, note, char, label, rowLength}) => {
	return (
		<StyledGridCell
			active={active}
			activeClue={activeClue}
			disabled={char === false}>

			<SpecialCellMarker
				revealed={revealed}
				incorrect={incorrect}
				isSunday={rowLength === 21}>
			</SpecialCellMarker>

			<GridCellLabel rowLength={rowLength}> 
				{label} 
			</GridCellLabel>

			<GridCellText
				correct={correct}
				note={note}
				rowLength={rowLength}> 
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
			left: ${props.isSunday ? "14px" : "21px"};
			border-top: ${props.isSunday ? "4px" : "5px"} solid #E63333;
			border-right: ${props.isSunday ? "4px" : "5px"} solid #E63333;
			border-bottom: ${props.isSunday ? "4px" : "5px"} solid transparent;
			border-left: ${props.isSunday ? "4px" : "5px"} solid transparent;
			@media (max-width: 1000px) {
				left: ${props.isSunday ? "10px" : "16px"};
			}
			@media (max-width: 650px) {
				left: ${props.isSunday ? "8px" : "13px"};
			}
		`};
	${props => props.incorrect &&
		css`
			height: 2px;
			width: ${props.isSunday ? "30px" : "45px"};
			top: ${props.isSunday ? "11px" : "14px"};
			left: ${props.isSunday ? "-5px" : "-7px"};
			background-color: #E63333;
			transform: rotate(-45deg);
			@media (max-width: 1000px) {
				width: ${props.isSunday ? "25px" : "37px"};
				left: ${props.isSunday ? "-3px" : "-5px"};
				top: ${props.isSunday ? "8px" : "12px"};
			}
			@media (max-width: 650px) {
				width: ${props.isSunday ? "21px" : "32px"};
				left: ${props.isSunday ? "-2px" : "-5px"};
				top: ${props.isSunday ? "7px" : "11px"};
			}
		`};
`;

const GridCellLabel = styled.span`
	font-size: ${props => props.rowLength * -0.5 + 20}px;
	position: absolute;
	top: ${props => props.rowLength < 10 ? 1.5 : 0}px;
	left: ${props => props.rowLength < 15 ? 1 : 0}px;
	line-height: ${props => props.rowLength * -0.5 + 21.5}px;
	letter-spacing: -1px;
	@media (max-width: 1000px) {
		font-size: ${props => props.rowLength * -0.5 + 18}px;
		line-height: ${props => props.rowLength * -0.5 + 19}px;
		top: 0;
		left: ${props => props.rowLength < 16 ? 0.5 : 0}px;
	}
	@media (max-width: 650px) {
		font-size: ${props => props.rowLength * -0.5 + 18}px;
		line-height: ${props => props.rowLength * -0.5 + 18.5}px;
		top: 0;
		left: 0;
	}
`;

const GridCellText = styled.span`
	vertical-align: middle;
	text-align: center;
	font-weight: 600;
	padding-top: 7px;
	font-size: ${props => props.rowLength * -1.2 + 39}px;
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
		font-size: ${props => props.rowLength * -1.2 + 38}px;
	}
	@media (max-width: 650px) {
		font-size: ${props => props.rowLength * -1.2 + 36}px;
	}
`;

export default GridCell;