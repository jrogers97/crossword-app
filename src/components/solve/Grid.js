import React from 'react';
import './styles/Grid.css';

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
		<div className="GridContainer">
			{[...Array(rowLength)].map((num, i) => 
				<GridRow 
					key={i} 
					rowNumber={i}
					gridRow={grid.slice(i * rowLength, i * rowLength + rowLength)}
					gridRowLabels={findGridRowLabels(labels, i, rowLength)}
					rowLength={rowLength}
					activeCell={activeCell}
					activeClueCells={findRowsCells(activeClueCells, i, rowLength)}
					correctCells={findRowsCells(correctCells, i, rowLength)}
					incorrectCells={findRowsCells(incorrectCells, i, rowLength)}
					revealedCells={findRowsCells(revealedCells, i, rowLength)}
					noteCells={findRowsCells(noteCells, i, rowLength)}
					handleCellClick={handleCellClick} />
			)}
		</div>
	);
}

export default Grid;
