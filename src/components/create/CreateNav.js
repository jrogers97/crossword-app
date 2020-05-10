import React, {useState} from 'react';
import styled from 'styled-components';
import eraserIcon from '../../icon/eraser.svg';
import saveIcon from '../../icon/save.svg';
import loadIcon from '../../icon/load.svg';
import checkIcon from '../../icon/check.svg';
import plusIcon from '../../icon/plus-circled.svg';
import printIcon from '../../icon/download.svg';
import helpIcon from '../../icon/question.svg';

const CreateNav = ({
    savedPuzzles,
    handleBlankClick,
    handleLoadClick,
    handlePrintClick,
    handleSaveClick,
    handleNewClick,
    handleHelpClick,
    puzzleSaved,
    puzzleName
}) => {
    const [blankButtonActive, setBlankButtonActive] = useState(false);
    const otherPuzzlesSaved = Object.keys(savedPuzzles).some(key => key !== puzzleName);

    return (
        <React.Fragment>
        <Button onClick={handleNewClick}>
            <ButtonIcon 
                src={plusIcon} 
                alt="New Puzzle" />
            <ButtonText> New Puzzle </ButtonText>
        </Button>
        <ButtonSet>
            <Button onClick={handleHelpClick}>
                <HelpIcon 
                    src={helpIcon}
                    alt="Help" />
            </Button>

            <BlankButton
                isActive={blankButtonActive}
                onClick={(e) => {
                    setBlankButtonActive(!blankButtonActive);
                    handleBlankClick(e);
                }}>
                <BlankIcon 
                    src={eraserIcon}
                    isActive={blankButtonActive}
                    alt="Eraser" />

                <BlankText isActive={blankButtonActive}> Eraser </BlankText>
            </BlankButton>

            {otherPuzzlesSaved && 
                <Button onClick={() => handleLoadClick(null)}>
                    <ButtonIcon 
                        src={loadIcon}
                        alt="Load Puzzle" />
                    <ButtonText> Load </ButtonText>
                </Button> 
            }

            <Button
                saved={puzzleSaved}
                onClick={() => handleSaveClick(null, false)}>
                <ButtonIcon
                    src={puzzleSaved ? checkIcon : saveIcon}
                    alt="Save Puzzle" />
                <ButtonText> {puzzleSaved ? "Saved" : "Save"} </ButtonText>
            </Button>

            <Button onClick={handlePrintClick}>
                <ButtonIcon src={printIcon} alt="Download" />
                <ButtonText> Download </ButtonText>
            </Button>
        </ButtonSet>
        </React.Fragment>
    );
}

const ButtonSet = styled.div`
    height: 100%;
    margin: 0 20px 0 auto;
    display: flex;
    justify-content: center;
`;

const Button = styled(({saved, ...rest}) => <button {...rest}/>)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: none;
    height: 100%;
    width: 80px;
    padding: 6px 20px;
    white-space: nowrap;
    background-color: transparent;
    pointer-events: ${props => props.saved ? "none" : "inherit"};
    &:hover {
		cursor: ${props => props.saved ? "auto" : "pointer"};
	}
    &:focus {
        outline: none;
    }
`;

const ButtonIcon = styled.img`
    height: 20px;
    width: 20px;
    vertical-align: middle;
    &:hover {
        cursor: pointer;
    }
`;

const ButtonText = styled.p`
    text-align: center;
    color: #555555;
    margin-top: 1px;
`;

const BlankButton = styled(({isActive, ...rest}) => <Button {...rest} />)`
    background-color: ${props => props.isActive ? "#4F85E5" : "transparent"};
`;

const BlankIcon = styled(({isActive, ...rest}) => <ButtonIcon {...rest} />)`
    filter: ${props => props.isActive ? "invert(1)" : "initial"};
`;

const BlankText = styled(({isActive, ...rest}) => <ButtonText {...rest} />)`
    color: ${props => props.isActive ? "white" : "#555555"};
`;

const HelpIcon = styled(ButtonIcon)`
    height: 16px;
    width: 16px;
`;

export default CreateNav;