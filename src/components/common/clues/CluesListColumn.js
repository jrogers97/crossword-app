import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import CluesListItem from './CluesListItem';

const CluesListColumn = ({
	mode,
	clues,
	greyedClues,
	activeClue,
	altDirectionActiveClue,
	handleClueClick,
	handleClueInput,
	label
}) => {
	const listColumnNode = useRef();
	const listItems = useRef();

	useEffect(() => {
		listColumnNode.current = document.querySelector(`#${label}`);
		listItems.current = Array.from(document.querySelectorAll(`#${label} .clues-list-item`));
	}, []);

	useEffect(() => {
		if (mode !== "create") {
			// get top offset of active clue list item, scroll to it
			const activeListItem = listItems.current.find(item => item.id === Object.keys(activeClue)[0]);
			const altActiveListItem = listItems.current.find(item => item.id === Object.keys(altDirectionActiveClue)[0]);

			const listItemOffset = activeListItem ? activeListItem.offsetTop - listColumnNode.current.offsetTop : null;
			const altListItemOffset = altActiveListItem ? altActiveListItem.offsetTop - listColumnNode.current.offsetTop : null;

			if (listItemOffset !== null) {
				listColumnNode.current.scrollTo({top: listItemOffset, behavior: 'smooth'});
			} else if (altListItemOffset !== null) {
				listColumnNode.current.scrollTo({top: altListItemOffset, behavior: 'smooth'});
			}
		}
	}, [activeClue, altDirectionActiveClue, mode]);

	return (
		<CluesListColumnContainer>
			<CluesListColumnLabel> {label} </CluesListColumnLabel>
			<StyledCluesListColumn id={label}>
				{Object.keys(clues).map(clueNum => 
					<CluesListItem 
						key={clueNum} 
						mode={mode}
						clueNum={clueNum} 
						clueText={clues[clueNum].clue}
						isActive={Object.keys(activeClue)[0] === clueNum}
						isGreyed={greyedClues.indexOf(clueNum) >= 0}
						isAltDirectionActive={Object.keys(altDirectionActiveClue)[0] === clueNum}
						handleClueClick={handleClueClick} 
						handleClueInput={handleClueInput} />
				)}
			</StyledCluesListColumn>
		</CluesListColumnContainer>
	);
}; 

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