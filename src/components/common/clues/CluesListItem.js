import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

const CluesListItem = React.memo(({clueNum, clueText, isActive, isAltDirectionActive, isGreyed, handleClueClick, handleClueInput, mode}) => {
	return (
		<StyledClueListItem 
			id={clueNum}
			className={"clues-list-item"}
			isActive={isActive}
			isGreyed={isGreyed} 
			onClick={e => handleClueClick(e, clueNum)}>

			<ClueSideTab isAltDirectionActive={isAltDirectionActive}></ClueSideTab>

			<ClueLabel>
				{clueNum.replace(/\D+/g, '')}
			</ClueLabel>

			<ClueText clueText={clueText}>
				{mode === "create" 
					? <ClueTextInput 
						placeholder="Add clue"
						value={clueText}
						isActive={isActive}
						data-clue-num={clueNum}
						onChange={handleClueInput} />
					: clueText} 
			</ClueText>
		</StyledClueListItem>
	);
})

const StyledClueListItem = styled.li`
	font-size: 14px;
	display: flex;
	line-height: 1.5;
	background-color: ${props => props.isActive ? "#a7d8ff!important" : "initial"};
	color: ${props => props.isGreyed ? "#808080" : "initial"};
	&:hover {
		background-color: rgba(167, 216, 255, 0.25);
		cursor: pointer;
	}
`;

const ClueSideTab = styled.span`
	min-width: 10px;
	background-color: ${props => props.isAltDirectionActive ? "#a7d8ff!important" : "initial"};
`;

const ClueLabel = styled.span`
	font-weight: bold;
	min-width: 25px;
	text-align: right;
	padding: 4px;
`;

const ClueText = styled.span`
	margin-left: 3px;
	padding: 4px 8px 4px 4px;
	width: 100%;
	display: flex;
	align-items: center;
	font-style: ${props => props.clueText.includes("*") ? "italic" : "normal"};
`;

const ClueTextInput = styled(({isActive, ...rest}) => <TextareaAutosize {...rest}/>)`
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
	&::placeholder {
		color: #888;
		opacity: ${props => props.isActive ? "1" : "0"};
	}
`;

export default CluesListItem;