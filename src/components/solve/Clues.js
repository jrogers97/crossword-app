import React from 'react';
import './styles/Clues.css';

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

const Clues = ({clues, grid, activeClue, altDirectionActiveClue, greyedClues, handleClueClick}) => {
	return (
		<div className="CluesContainer">
			<CluesListColumn 
				clues={separateAcrossDownClues(clues)[0]} 
				greyedClues={separateAcrossDownGreyedClues(greyedClues)[0]}
				grid={grid}
				activeClue={activeClue}
				altDirectionActiveClue={altDirectionActiveClue}
				handleClueClick={handleClueClick}
				label="Across" />
			<CluesListColumn 
				clues={separateAcrossDownClues(clues)[1]} 
				greyedClues={separateAcrossDownGreyedClues(greyedClues)[1]}
				grid={grid}
				activeClue={activeClue}
				altDirectionActiveClue={altDirectionActiveClue}
				handleClueClick={handleClueClick}
				label="Down" />
		</div>
	);
}

export default Clues;