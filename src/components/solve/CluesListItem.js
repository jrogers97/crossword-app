import React from 'react';
import './styles/CluesListItem.css';

const getClueClass = (isActive, isGreyed) => {
	let cssClass = "CluesListItem ";

	if (isActive) {
		cssClass += " activeClueListItem";
	}

	if (isGreyed) {
		cssClass += " greyed";
	}

	return cssClass;
};

const getClueSideLabelClass = isAltDirectionActive => {
	return "CluesListItem-SideTab" + (isAltDirectionActive ? " altActiveClueSideTab" : "");
}

const getClueTextClass = clue => {
	return "CluesListItem-Text" + (clue.includes("*") ? " italic" : "");
}

const CluesListItem = ({clueNum, clueText, isActive, isAltDirectionActive, isGreyed, handleClueClick, mode}) => {
	return (
		<li id={clueNum} 
			className={getClueClass(isActive, isGreyed)} 
			onClick={e => handleClueClick(e, clueNum)}>

			<span className={getClueSideLabelClass(isAltDirectionActive)}></span>

			<span className="CluesListItem-Label">
				{clueNum.replace(/\D+/g, '')}
			</span>

			<span className={getClueTextClass(clueText)}>
				{mode === "create" 
					? <textarea placeholder="Add clue" className="CluesListItem-Input" defaultValue={clueText}/> 
					: clueText} 
			</span>
		</li>
	);
}

export default CluesListItem;