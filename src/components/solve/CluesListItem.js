import React from 'react';
import './styles/CluesListItem.css';

const getClueExtraCssClass = (isActive, isGreyed) => {
	let cssClass = "";

	if (isActive) {
		cssClass += " activeClueListItem";
	}

	if (isGreyed) {
		cssClass += " greyed";
	}

	return cssClass;
};

const getClueSideLabelExtraClass = isAltDirectionActive => {
	return isAltDirectionActive ? " altActiveClueSideTab" : "";
}

const getClueTextExtraCssClass = clue => {
	return clue.includes("*") ? "italic" : "";
}

const CluesListItem = ({clueNum, clueText, isActive, isAltDirectionActive, isGreyed, handleClueClick}) => {
	return (
		<li id={clueNum} 
			className={"CluesListItem " + getClueExtraCssClass(isActive, isGreyed)} 
			onClick={e => handleClueClick(e, clueNum)}>

			<span className={"CluesListItem-SideTab " + getClueSideLabelExtraClass(isAltDirectionActive)}></span>

			<span className="CluesListItem-Label">
				{clueNum.replace(/\D+/g, '')}
			</span>

			<span className={"CluesListItem-Text " + getClueTextExtraCssClass(clueText)}>
				{clueText}
			</span>
		</li>
	);
}

export default CluesListItem;