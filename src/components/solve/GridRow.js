import React from 'react';
import styled from 'styled-components';
// import './styles/GridRow.css';
import GridCell from './GridCell';

	// specific update conditions to avoid unnecessary renders
// 	shouldComponentUpdate(nextProps) {
// 		return JSON.stringify(nextProps.gridRow)         !== JSON.stringify(this.props.gridRow)
// 			|| JSON.stringify(nextProps.activeClueCells) !== JSON.stringify(this.props.activeClueCells)
// 			|| JSON.stringify(nextProps.incorrectCells)  !== JSON.stringify(this.props.incorrectCells)
// 			|| JSON.stringify(nextProps.correctCells)    !== JSON.stringify(this.props.correctCells)
// 			|| JSON.stringify(nextProps.revealedCells)   !== JSON.stringify(this.props.revealedCells)
// 			|| JSON.stringify(nextProps.noteCells)       !== JSON.stringify(this.props.noteCells)
// 			|| JSON.stringify(nextProps.gridRowLabels)   !== JSON.stringify(this.props.gridRowLabels)
// 			|| (Math.floor(nextProps.activeCell / nextProps.rowLength) === nextProps.rowNumber 
// 			|| Math.floor(this.props.activeCell / this.props.rowLength) === this.props.rowNumber);
// 	}

const GridRow = ({
	rowNumber,
	gridRow,
	gridRowLabels,
	rowLength,
	isSunday,
	activeCell,
	activeClueCells,
	correctCells,
	incorrectCells,
	revealedCells,
	noteCells,
	handleCellClick
}) => {
	return (
		<StyledGridRow isSunday={isSunday}>
			{[...Array(gridRow.length)].map((num, i) => 
				<GridCellContainer 
					key={[rowNumber, i]}
					isSunday={isSunday}
					onClick={e => handleCellClick(e, rowNumber * rowLength + i)} >
					<GridCell 
						active={isActiveCell(i, rowNumber, activeCell, rowLength)}
						activeClue={isRelevantCell(activeClueCells, i, rowNumber, rowLength)}
						correct={isRelevantCell(correctCells, i, rowNumber, rowLength)}
						incorrect={isRelevantCell(incorrectCells, i, rowNumber, rowLength)}
						revealed={isRelevantCell(revealedCells, i, rowNumber, rowLength)}
						note={isRelevantCell(noteCells, i, rowNumber, rowLength)}
						label={getCellLabel(i, rowLength, gridRowLabels)} 
						isSunday={isSunday}
						char={gridRow[i]} />
				</GridCellContainer>
			)}
		</StyledGridRow>
	)
}

const isActiveCell = (col, row, activeCell, rowLength) => {
	return (row === Math.floor(activeCell / rowLength)) && (col === activeCell % rowLength);
}

const isRelevantCell = (cells, col, row, rowLength) => {
	return cells.some(cell => Math.floor(cell / rowLength) === row && cell % rowLength === col);
}

const getCellLabel = (col, rowLength, labels) => {
	const label = labels.find(label => label[0] % rowLength === col);
	return label ? label[1] : "";
}

const StyledGridRow = styled.div`
	display: flex;
	width: 100%;
	height: ${props => props.isSunday ? "4.7619%": "6.666667%"};
	&:last-child {
		border-bottom: 1px solid #383838;
		height: ${props => props.isSunday ? "calc(4.7619% + 1px)" : "calc(6.666667% + 1px)"};
	}
`;

const GridCellContainer = styled.div`
	height: 100%;
	border-top: 1px solid #383838;
	border-left: 1px solid #383838;
	width: ${props => props.isSunday ? "4.7619%" : "6.666667%"};
	&:nth-child(15n) {
		border-right: ${props => props.isSunday ? "none" : "1px solid #383838"};
	}
	&:nth-child(21n) {
		border-right: ${props => props.isSunday ? "1px solid #383838" : "none"};
	}
`;

export default GridRow;
