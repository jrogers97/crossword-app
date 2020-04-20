import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import './styles/ClueBanner.css';

const getBannerText = clue => {
	return clue.clue
		.replace("&amp;", "&")
		.replace("&reg;", "®");
}

const ClueBanner = ({label, clue = {clue: ""}, handleClueInput, mode}) => {
	const clueText = getBannerText(clue);
	return (
		<StyledClueBanner>
			<ClueBannerLabel> {label} </ClueBannerLabel>
			<ClueBannerText text={clue.clue}>
				{mode === "create" 
					? <ClueBannerTextInput 
						placeholder="Add clue"
						value={clueText}
						data-clue-num={label}
						onChange={handleClueInput} />
					: clueText}  
			</ClueBannerText>
		</StyledClueBanner>
	);
}

const StyledClueBanner = styled.div`
	width: 100%;
	background-color: #dceffe;
	border-radius: 2px;
	display: flex;
	align-items: center;
	line-height: 1.3;
	padding: 5px;
	margin: 10px 0;
	height: 50px;
`;

const ClueBannerLabel = styled.span`
	font-weight: bold;
	font-size: 16px;
	padding: 0 10px;
`;

const ClueBannerText = styled.span`
	font-size: 16px;
	padding: 5px;
	flex: 1;
	font-style: ${props => (props.text.includes("*") ? "italic" : "normal")}
`;

const ClueBannerTextInput = styled(TextareaAutosize)`
	background-color: transparent;
	border: none;
	font-size: 14px;
	height: 18px;
	width: 100%;
	display: block;
	resize: none;
	&:focus {
		outline: none;
	}
`;

export default ClueBanner;