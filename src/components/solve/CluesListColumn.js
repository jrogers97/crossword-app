import React, { Component } from 'react';
import styled from 'styled-components';
// import './styles/CluesListColumn.css';

import CluesListItem from './CluesListItem';

class CluesListColumn extends Component {

	constructor(props) {
		super(props);

		this.listItems = [];
		this.listColumnNode = null;
		this.listColumnOffset = 0;
	}

	componentDidMount() {
		this.listColumnNode = document.querySelector(`#${this.props.label}`);
		this.listColumnOffset = this.listColumnNode.offsetTop;
		this.listItems = Array.from(document.querySelectorAll(`#${this.props.label} .clues-list-item`));
	}

	componentDidUpdate() {
		// get top offset of active clue list item, scroll to it
		const activeListItem = this.listItems.find(item => item.id === Object.keys(this.props.activeClue)[0]);
		const altActiveListItem = this.listItems.find(item => item.id === Object.keys(this.props.altDirectionActiveClue)[0]);

		const listItemOffset = activeListItem ? activeListItem.offsetTop - this.listColumnOffset : null;
		const altListItemOffset = altActiveListItem ? altActiveListItem.offsetTop - this.listColumnOffset : null;

		if (listItemOffset !== null) {
			this.listColumnNode.scrollTo({top: listItemOffset, behavior: 'smooth'});
		} else if (altListItemOffset !== null) {
			this.listColumnNode.scrollTo({top: altListItemOffset, behavior: 'smooth'});
		}
	}

	isGreyedClue(clueNum) {
		return this.props.greyedClues.indexOf(clueNum) >= 0;
	}

	isActiveClue(clueNum, activeClue) {
		return Object.keys(activeClue)[0] === clueNum;
	}

	render() {
		return (
			<CluesListColumnContainer>
				<CluesListColumnLabel> {this.props.label} </CluesListColumnLabel>
				<StyledCluesListColumn id={this.props.label}>
					{Object.keys(this.props.clues).map(clueNum => 
						<CluesListItem 
							key={clueNum} 
							mode={this.props.mode}
							clueNum={clueNum} 
							clueText={this.props.clues[clueNum].clue}
							isActive={this.isActiveClue(clueNum, this.props.activeClue)}
							isGreyed={this.isGreyedClue(clueNum)}
							isAltDirectionActive={this.isActiveClue(clueNum, this.props.altDirectionActiveClue)}
							handleClueClick={this.props.handleClueClick} 
							handleClueInput={this.props.handleClueInput} />
					)}
				</StyledCluesListColumn>
			</CluesListColumnContainer>
		);
	}
}

const CluesListColumnContainer = styled.div`
	width: 100%;
	height: 100%;	
	margin-right: 10px;
	@media (max-width: 920px) {
		height: 46%;
	}
`;

const CluesListColumnLabel = styled.p`
	font-weight: bold;
	padding: 18px 0 5px 0;
	border-bottom: 1px solid rgba(0,0,0,0.2);
`;

const StyledCluesListColumn = styled.ul`
	overflow-y: scroll;
	max-height: 85%;
	border-bottom: 1px solid rgba(0,0,0,0.2);
`;

export default CluesListColumn;