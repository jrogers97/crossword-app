import React from 'react';
import styled from 'styled-components';
// import './styles/Clues.css';

import CluesListColumn from './CluesListColumn';

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
}

const separateAcrossDownGreyedClues = (greyedClues) => {
	let separatedClues = [];
	["a", "d"].forEach(clueType => {
		separatedClues.push(greyedClues.filter(clue => clue.toLowerCase().includes(clueType)));
	});

	return separatedClues;
}

const Clues = ({clues, grid, activeClue, altDirectionActiveClue, greyedClues, handleClueClick, handleClueInput, mode}) => {
	return (
		<CluesContainer>
			<CluesListColumn 
				mode={mode}
				clues={separateAcrossDownClues(clues)[0]} 
				greyedClues={greyedClues ? separateAcrossDownGreyedClues(greyedClues)[0] : []}
				grid={grid}
				activeClue={activeClue}
				altDirectionActiveClue={altDirectionActiveClue}
				handleClueClick={handleClueClick}
				handleClueInput={handleClueInput}
				label="Across" />
			<CluesListColumn 
				mode={mode}
				clues={separateAcrossDownClues(clues)[1]} 
				greyedClues={greyedClues ? separateAcrossDownGreyedClues(greyedClues)[1] : []}
				grid={grid}
				activeClue={activeClue}
				altDirectionActiveClue={altDirectionActiveClue}
				handleClueClick={handleClueClick}
				handleClueInput={handleClueInput}
				label="Down" />
		</CluesContainer>
	);
}

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