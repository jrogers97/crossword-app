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

const Clues = ({clues, grid, activeCell, activeClue, altDirectionActiveClue, handleClueClick, isGreyed}) => {
	return (
		<div className="CluesContainer">
			<CluesListColumn 
				clues={separateAcrossDownClues(clues)[0]} 
				grid={grid}
				activeClue={activeClue}
				altDirectionActiveClue={altDirectionActiveClue}
				handleClueClick={handleClueClick}
				isGreyed={isGreyed}
				label="Across"/>
			<CluesListColumn 
				clues={separateAcrossDownClues(clues)[1]} 
				grid={grid}
				activeClue={activeClue}
				altDirectionActiveClue={altDirectionActiveClue}
				handleClueClick={handleClueClick}
				isGreyed={isGreyed}
				label="Down" />
		</div>
	);
}

export default Clues;