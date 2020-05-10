import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import CluesListItem from './CluesListItem';

const CluesListColumn = ({
	mode,
	clues,
	greyedClues,
	activeClue,
	altDirectionActiveClue,
	handleClearClick,
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
	}, [activeClue, altDirectionActiveClue, mode]);

	return (
		<CluesListColumnContainer>
			<CluesListColumnHeader>
				<HeaderLabel> {label} </HeaderLabel>
				{mode === "create" && 
					<HeaderClearLink onClick={() => handleClearClick(label)}> Clear </HeaderClearLink>}
			</CluesListColumnHeader>
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

const CluesListColumnHeader = styled.div`
	display: flex;
	align-items: flex-end;
	padding: 18px 0 5px 0;
	border-bottom: 1px solid rgba(0,0,0,0.2);
`;

const HeaderLabel = styled.p`
	font-weight: bold;
`;

const HeaderClearLink = styled.button`
	font-size: 12px;
	font-weight: bold;
	color: #0b7b99;
	border: none;
	background-color: transparent;
	margin: 0 10px 0 auto;
	&:focus {
		outline: none;
	}
	&:hover {
		cursor: pointer
	}
`;

const StyledCluesListColumn = styled.ul`
	overflow-y: scroll;
	max-height: 85%;
	border-bottom: 1px solid rgba(0,0,0,0.2);
`;

export default CluesListColumn;