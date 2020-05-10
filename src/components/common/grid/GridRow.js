import React from 'react';
import styled from 'styled-components';
import GridCell from './GridCell';

const GridRow = ({
	rowNumber,
	gridRow,
	gridRowLabels,
	rowLength,
	activeCell,
	activeClueCells,
	correctCells,
	incorrectCells,
	revealedCells,
	noteCells,
	handleCellClick
}) => {
	return (
		<StyledGridRow rowLength={rowLength}>
			{[...Array(gridRow.length)].map((num, i) => 
				<GridCellContainer 
					key={[rowNumber, i]}
					rowLength={rowLength}
					onClick={e => handleCellClick(e, rowNumber * rowLength + i)} >
					<GridCell 
						active={isActiveCell(i, rowNumber, activeCell, rowLength)}
						activeClue={isRelevantCell(activeClueCells, i, rowNumber, rowLength)}
						correct={isRelevantCell(correctCells, i, rowNumber, rowLength)}
						incorrect={isRelevantCell(incorrectCells, i, rowNumber, rowLength)}
						revealed={isRelevantCell(revealedCells, i, rowNumber, rowLength)}
						note={isRelevantCell(noteCells, i, rowNumber, rowLength)}
						label={getCellLabel(i, rowLength, gridRowLabels)} 
						rowLength={rowLength}
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
	height: ${props => 100 / props.rowLength}%;
	&:last-child {
		border-bottom: 1px solid #383838;
		height: calc(${props => 100 / props.rowLength}% + 1px);
	}
`;

const GridCellContainer = styled.div`
	height: 100%;
	border-top: 1px solid #383838;
	border-left: 1px solid #383838;
	width: ${props => 100 / props.rowLength + "%"};
	&:nth-child(${props => props.rowLength}n) {
		border-right: 1px solid #383838;
	}
`;

export default GridRow;
