import React from 'react';
import './styles/Grid.css';

import GridRow from './GridRow';

const findRowsCells = (cells, row) => cells.filter(cell => cell[0] === row);

const findGridRowLabels = (labels, row) => labels.filter(label => label[0][0] === row);

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
					gridRow={grid[i]}
					gridRowLabels={findGridRowLabels(labels, i)}
					activeCell={activeCell}
					activeClueCells={findRowsCells(activeClueCells, i)}
					correctCells={findRowsCells(correctCells, i)}
					incorrectCells={findRowsCells(incorrectCells, i)}
					revealedCells={findRowsCells(revealedCells, i)}
					noteCells={findRowsCells(noteCells, i)}
					handleCellClick={handleCellClick} />
			)}
		</div>
	);
}

export default Grid;
