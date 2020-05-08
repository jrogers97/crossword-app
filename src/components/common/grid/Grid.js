import React from 'react';
import styled from 'styled-components';
import GridRow from './GridRow';

const findRowsCells = (cells, row, rowLength) => cells.filter(cell => Math.floor(cell / rowLength) === row);

const findGridRowLabels = (labels, row, rowLength) => labels.filter(label => Math.floor(label[0] / rowLength) === row);

const Grid = ({
	grid, 
	activeCell, 
	activeClueCells, 
	correctCells, 
	incorrectCells, 
	revealedCells, 
	noteCells,
	labels, 
	rowLength, 
	handleCellClick
}) => {
	return (
		<GridContainer>
			{[...Array(rowLength)].map((num, i) => 
				<GridRow 
					key={i} 
					rowNumber={i}
					gridRow={grid.slice(i * rowLength, i * rowLength + rowLength)}
					gridRowLabels={findGridRowLabels(labels, i, rowLength)}
					rowLength={rowLength}
					isSunday={rowLength === 21}
					activeCell={activeCell}
					activeClueCells={findRowsCells(activeClueCells, i, rowLength)}
					correctCells={correctCells ? findRowsCells(correctCells, i, rowLength) :  []}
					incorrectCells={incorrectCells ? findRowsCells(incorrectCells, i, rowLength) : []}
					revealedCells={revealedCells ? findRowsCells(revealedCells, i, rowLength) : []}
					noteCells={noteCells ? findRowsCells(noteCells, i, rowLength) : []}
					handleCellClick={handleCellClick} />
			)}
		</GridContainer>
	);
}

const GridContainer = styled.div`
	width: 100%;
	height: 480px;
	margin-bottom: 10px;
	@media (max-width: 1000px) {
		height: 400px;
	}
	@media (max-width: 650px) {
		height: 350px;
	}
	-webkit-user-select: none; /* Safari */        
  	-moz-user-select: none; /* Firefox */
 	-ms-user-select: none; /* IE10+/Edge */
  	user-select: none; /* Standard */
`;

export default Grid;
