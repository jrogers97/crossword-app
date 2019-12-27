import React from 'react';
import './styles/ClueBanner.css';

const getExtraBannerTextClass = text => {
	return text.includes("*") ? "italic" : "";
}

const ClueBanner = ({label, clue}) => {
	return (
		<div className="ClueBanner">
			<span className="ClueBanner-label"> {label} </span>
			<span className={"ClueBanner-text " + getExtraBannerTextClass(clue.clue)}> 
				{clue.clue.replace("&amp;", "&")} 
			</span>
		</div>
	);
	
}

export default ClueBanner;