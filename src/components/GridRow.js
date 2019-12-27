import React, { Component } from 'react';
import './styles/GridRow.css';

import GridCell from './GridCell';

class GridRow extends Component {

	isActiveCell(col) {
		return (this.props.rowNumber === this.props.activeCell[0]) && (col === this.props.activeCell[1]);
	}

	isRelevantCell(cells, col) {
		return cells.some(cell => cell[0] === this.props.rowNumber && cell[1] === col);
	}

	getCellLabel(col) {
		let label = this.props.gridRowLabels.find(label => label[0][1] === col);
		return label ? label[1] : "";
	}

	shouldComponentUpdate(nextProps) {
		return JSON.stringify(nextProps.gridRow) !== JSON.stringify(this.props.gridRow)
			|| JSON.stringify(nextProps.activeClueCells) !== JSON.stringify(this.props.activeClueCells)
			|| JSON.stringify(nextProps.incorrectCells) !== JSON.stringify(this.props.incorrectCells)
			|| JSON.stringify(nextProps.correctCells) !== JSON.stringify(this.props.correctCells)
			|| JSON.stringify(nextProps.revealedCells) !== JSON.stringify(this.props.revealedCells)
			|| JSON.stringify(nextProps.noteCells) !== JSON.stringify(this.props.noteCells)
			|| (nextProps.activeCell[0] === nextProps.rowNumber || this.props.activeCell[0] === nextProps.rowNumber);
	}

	render() {
		return (
			<div className="GridRow">
				{[...Array(this.props.gridRow.length)].map((num, i) => 
					<div className="GridCellContainer" 
						 key={[this.props.rowNumber, i]}
						 onClick={e => this.props.handleCellClick(e, this.props.rowNumber, i)} >
						<GridCell 
							active={this.isActiveCell(i)}
							activeClue={this.isRelevantCell(this.props.activeClueCells, i)}
							correct={this.isRelevantCell(this.props.correctCells, i)}
							incorrect={this.isRelevantCell(this.props.incorrectCells, i)}
							revealed={this.isRelevantCell(this.props.revealedCells, i)}
							note={this.isRelevantCell(this.props.noteCells, i)}
							char={this.props.gridRow[i]}
							label={this.getCellLabel(i)} />
					</div>
				)}
			</div>
		);
	}
}

export default GridRow;
