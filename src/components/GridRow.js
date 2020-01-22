import React, { Component } from 'react';
import './styles/GridRow.css';

import GridCell from './GridCell';

class GridRow extends Component {

	isActiveCell(col) {
		// console.log((this.props.rowNumber === Math.floor(this.props.activeCell / this.props.rowLength)) && (col === this.props.activeCell % this.props.rowLength));
		return (this.props.rowNumber === Math.floor(this.props.activeCell / this.props.rowLength)) && (col === this.props.activeCell % this.props.rowLength);
	}

	isRelevantCell(cells, col, rowLength) {
		return cells.some(cell => Math.floor(cell / rowLength) === this.props.rowNumber && cell % rowLength === col);
	}

	getCellLabel(col, rowLength) {
		const label = this.props.gridRowLabels.find(label => label[0] % rowLength === col);
		return label ? label[1] : "";
	}

	shouldComponentUpdate(nextProps) {
		// console.log('active clue cells: ', nextProps.activeClueCells, this.props.activeClueCells);
		// console.log(JSON.stringify(nextProps.gridRow) !== JSON.stringify(this.props.gridRow)
		// 	|| JSON.stringify(nextProps.activeClueCells) !== JSON.stringify(this.props.activeClueCells)
		// 	|| JSON.stringify(nextProps.incorrectCells) !== JSON.stringify(this.props.incorrectCells)
		// 	|| JSON.stringify(nextProps.correctCells) !== JSON.stringify(this.props.correctCells)
		// 	|| JSON.stringify(nextProps.revealedCells) !== JSON.stringify(this.props.revealedCells)
		// 	|| JSON.stringify(nextProps.noteCells) !== JSON.stringify(this.props.noteCells)
		// 	|| (Math.floor(nextProps.activeCell / nextProps.rowLength) === nextProps.rowNumber || this.props.activeCell % this.props.rowLength === nextProps.rowNumber));
		// console.log(nextProps.gridRow, this.props.gridRow);

		return JSON.stringify(nextProps.gridRow)         !== JSON.stringify(this.props.gridRow)
			|| JSON.stringify(nextProps.activeClueCells) !== JSON.stringify(this.props.activeClueCells)
			|| JSON.stringify(nextProps.incorrectCells)  !== JSON.stringify(this.props.incorrectCells)
			|| JSON.stringify(nextProps.correctCells)    !== JSON.stringify(this.props.correctCells)
			|| JSON.stringify(nextProps.revealedCells)   !== JSON.stringify(this.props.revealedCells)
			|| JSON.stringify(nextProps.noteCells)       !== JSON.stringify(this.props.noteCells)
			|| (Math.floor(nextProps.activeCell / nextProps.rowLength) === nextProps.rowNumber 
			|| Math.floor(this.props.activeCell / this.props.rowLength) === this.props.rowNumber);
	}

	render() {
		return (
			<div className="GridRow">
				{[...Array(this.props.gridRow.length)].map((num, i) => 
					<div className="GridCellContainer" 
						 key={[this.props.rowNumber, i]}
						 onClick={e => this.props.handleCellClick(e, this.props.rowNumber * this.props.rowLength + i)} >
						<GridCell 
							active     = {this.isActiveCell(i)}
							activeClue = {this.isRelevantCell(this.props.activeClueCells, i, this.props.rowLength)}
							correct    = {this.isRelevantCell(this.props.correctCells, i, this.props.rowLength)}
							incorrect  = {this.isRelevantCell(this.props.incorrectCells, i, this.props.rowLength)}
							revealed   = {this.isRelevantCell(this.props.revealedCells, i, this.props.rowLength)}
							note       = {this.isRelevantCell(this.props.noteCells, i, this.props.rowLength)}
							label      = {this.getCellLabel(i, this.props.rowLength)} 
							char       = {this.props.gridRow[i]} />
					</div>
				)}
			</div>
		);
	}
}

export default GridRow;
