import React from 'react';
import './styles/ClueBanner.css';

const getBannerTextClass = text => {
	return "ClueBanner-text " + (text.includes("*") ? "italic" : "");
}

const ClueBanner = ({label, clue = {clue: ""}}) => {
	return (
		<div className="ClueBanner">
			<span className="ClueBanner-label"> {label} </span>
			<span className={getBannerTextClass(clue.clue)}> 
				{clue.clue.replace("&amp;", "&").replace("&reg;", "®")} 
			</span>
		</div>
	);
	
}

export default ClueBanner;