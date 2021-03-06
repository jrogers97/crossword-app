import React from 'react';
import styled from 'styled-components';
import GridRow from './GridRow';

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
	blankMode,
	handleCellClick
}) => {
	return (
		<GridContainer shadow={blankMode}>
			{[...Array(rowLength)].map((num, i) => 
				<GridRow 
					key={i} 
					rowNumber={i}
					gridRow={grid.slice(i * rowLength, i * rowLength + rowLength)}
					gridRowLabels={findGridRowLabels(labels, i, rowLength)}
					rowLength={rowLength}
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
};

const findRowsCells = (cells, row, rowLength) => cells.filter(cell => Math.floor(cell / rowLength) === row);

const findGridRowLabels = (labels, row, rowLength) => labels.filter(label => Math.floor(label[0] / rowLength) === row);

const GridContainer = styled.div`
	width: 100%;
	height: 480px;
	margin-bottom: 10px;
	user-select: none;
	box-shadow: ${props => props.shadow ? "0px 5px 6px rgba(0,0,0,0.6)" : "none"};
	transition: box-shadow 0.2s ease-out;
	@media (max-width: 1000px) {
		height: 400px;
	}
	@media (max-width: 650px) {
		height: 350px;
	}
`;

export default Grid;
