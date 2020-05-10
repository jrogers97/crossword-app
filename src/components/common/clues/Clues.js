import React from 'react';
import styled from 'styled-components';

import CluesListColumn from './CluesListColumn';

const Clues = ({
	clues, 
	activeClue, 
	altDirectionActiveClue, 
	greyedClues, 
	handleClearClick,
	handleClueClick, 
	handleClueInput, 
	mode
}) => {
	return (
		<CluesContainer>
			<CluesListColumn 
				mode={mode}
				clues={separateAcrossDownClues(clues)[0]} 
				greyedClues={greyedClues ? separateAcrossDownGreyedClues(greyedClues)[0] : []}
				activeClue={activeClue}
				altDirectionActiveClue={altDirectionActiveClue}
				handleClearClick={handleClearClick}
				handleClueClick={handleClueClick}
				handleClueInput={handleClueInput}
				label="Across" />
			<CluesListColumn 
				mode={mode}
				clues={separateAcrossDownClues(clues)[1]} 
				greyedClues={greyedClues ? separateAcrossDownGreyedClues(greyedClues)[1] : []}
				activeClue={activeClue}
				altDirectionActiveClue={altDirectionActiveClue}
				handleClearClick={handleClearClick}
				handleClueClick={handleClueClick}
				handleClueInput={handleClueInput}
				label="Down" />
		</CluesContainer>
	);
};

const separateAcrossDownClues = (clues) => {
	let separatedClues = [];
	["a", "d"].forEach(clueType => {
		separatedClues.push(
			Object.keys(clues)
				.filter(clue => clue.toLowerCase().includes(clueType))
				.reduce((res,key) => {
					res[key] = clues[key]; 
					return res
				}, {})
		);
	});

	return separatedClues;
};

const separateAcrossDownGreyedClues = (greyedClues) => {
	let separatedClues = [];
	["a", "d"].forEach(clueType => {
		separatedClues.push(greyedClues.filter(clue => clue.toLowerCase().includes(clueType)));
	});

	return separatedClues;
};

const CluesContainer = styled.div`
	min-height: 540px;
	height: 100%;
	display: flex;
	margin-right: 5px;
	max-width: 600px;
	@media (max-width: 920px) {
		flex-direction: column;
		max-width: 480px;
	}
`;

export default Clues;