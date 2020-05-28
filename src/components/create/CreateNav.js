import React, {useState, useRef, useEffect, Fragment} from 'react';
import styled from 'styled-components';
import eraserIcon from '../../icon/eraser.svg';
import mirroredEraserIcon from '../../icon/flip.svg';
import saveIcon from '../../icon/save.svg';
import loadIcon from '../../icon/load.svg';
import checkIcon from '../../icon/check.svg';
import plusIcon from '../../icon/plus-circled.svg';
import printIcon from '../../icon/download.svg';
import helpIcon from '../../icon/question.svg';
import chevronIcon from '../../icon/chevron.svg';

const CreateNav = ({
    savedPuzzles,
    blankMode,
    blankModeType,
    handleBlankClick,
    handleEraserTypeClick,
    handleLoadClick,
    handlePrintClick,
    handleSaveClick,
    handleNewClick,
    handleHelpClick,
    puzzleSaved,
    puzzleName
}) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [eraserDropdownActive, setEraserDropdownActive] = useState(false);
    const otherPuzzlesSaved = Object.keys(savedPuzzles).some(key => key !== puzzleName);

    const tooltipRef = useRef(null);
    const helpButtonRef = useRef(null);

    const eraserRef = useRef(null);
    const dropdownRef = useRef(null);

    const bindTooltipPosition = () => {
        if (helpButtonRef.current && tooltipRef.current) {
            const buttonOffsetTop = helpButtonRef.current.offsetTop;
            const buttonOffsetLeft = helpButtonRef.current.offsetLeft;
            const buttonHeight = helpButtonRef.current.offsetHeight;
            const buttonWidth = helpButtonRef.current.offsetWidth;
            const tooltipWidth = tooltipRef.current.offsetWidth;

            tooltipRef.current.style.top = `${buttonOffsetTop + buttonHeight}px`;
            tooltipRef.current.style.left = `${buttonOffsetLeft - (tooltipWidth / 2) + (buttonWidth / 2)}px`;
        }
    };

    const bindDropdownPosition = () => {
        if (eraserRef.current && dropdownRef.current) {
            const buttonOffsetTop = eraserRef.current.offsetTop;
            const buttonOffsetLeft = eraserRef.current.offsetLeft;
            const buttonHeight = eraserRef.current.offsetHeight;

            dropdownRef.current.style.top = `${buttonOffsetTop + buttonHeight + 1}px`;
            dropdownRef.current.style.left = `${buttonOffsetLeft}px`;
        }
    }

    const closeDropdown = e => {
        const target = e.target.id;
        if (target !== "eraser-button"
            && target !== "eraser-icon" 
            && target !== "eraser-text" 
            && target !== "dropdown-trigger" 
            && target !== "dropdown-icon"
            && target !== "eraser-dropdown") {
            setEraserDropdownActive(false);
        }
    }

    useEffect(() => {
        let resizeId;
        const handleResize = () => {
            clearTimeout(resizeId);
            resizeId = setTimeout(() => {
                bindDropdownPosition();
                if (tooltipVisible) {
                    bindTooltipPosition();
                }
            }, 500);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('click', closeDropdown);

        if (!localStorage.getItem("onboardTooltipSeen")) {
            setTimeout(() => {
                setTooltipVisible(true);
                bindTooltipPosition();
            }, 3000);

            localStorage.setItem("onboardTooltipSeen", "true");
        }

        bindDropdownPosition();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("click", closeDropdown);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        bindTooltipPosition();
        bindDropdownPosition();
    }, [savedPuzzles]);

    return (
        <React.Fragment>
        <Button onClick={handleNewClick}>
            <ButtonIcon 
                src={plusIcon} 
                alt="New Puzzle" />
            <ButtonText> New Puzzle </ButtonText>
        </Button>
        <ButtonSet>
            <Button onClick={handleHelpClick} ref={helpButtonRef}>
                <HelpIcon 
                    src={helpIcon}
                    alt="Help" />
            </Button>

            <BlankButton
                id="eraser-button"
                isActive={blankMode}
                ref={eraserRef}
                onClick={handleBlankClick}>
                <BlankIcon 
                    id="eraser-icon"
                    src={blankModeType === "regular" ? eraserIcon : mirroredEraserIcon}
                    rotate={(blankModeType === "mirrored").toString()}
                    isActive={blankMode}
                    alt="Eraser" />

                <BlankText id="eraser-text" isActive={blankMode}> Eraser </BlankText>
            </BlankButton>
            <DropdownChevron 
                id="dropdown-trigger" 
                onClick={() => setEraserDropdownActive(!eraserDropdownActive)}>
                <ChevronIcon id="dropdown-icon" src={chevronIcon}/>
            </DropdownChevron>

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

        <EraserDropdown 
            id="eraser-dropdown"
            isActive={eraserDropdownActive} 
            ref={dropdownRef}>
            <EraserOption onClick={() => handleEraserTypeClick("regular")}>
                <OptionActiveIndicator isActive={blankModeType === "regular"}/>
                <OptionIcon src={eraserIcon} />
                <OptionText>Regular</OptionText>
            </EraserOption>
            <EraserOption onClick={() => handleEraserTypeClick("mirrored")}>
                <OptionActiveIndicator isActive={blankModeType === "mirrored"}/>
                <OptionIcon rotate={"true"} src={mirroredEraserIcon} />
                <OptionText>Mirrored</OptionText>
            </EraserOption>
        </EraserDropdown>

        {tooltipVisible && 
            <Fragment>
                <Tooltip ref={tooltipRef}>
                    <p>Need help getting started? Click here for some useful tips!</p>
                    <TooltipButton onClick={() => setTooltipVisible(false)}>Got it</TooltipButton>
                </Tooltip>

                <Overlay/>
            </Fragment>
        }
        </React.Fragment>
    );
}

const ButtonSet = styled.div`
    height: 100%;
    margin: 0 20px 0 auto;
    display: flex;
    justify-content: center;
`;

const Button = styled.button`
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

const BlankButton = styled(Button)`
    width: 60px;
    background-color: ${props => props.isActive ? "#4F85E5" : "transparent"};
`;

const BlankIcon = styled(ButtonIcon)`
    filter: ${props => props.isActive ? "invert(1)" : "initial"};
    transform: ${props => props.rotate === "true" ? "rotate(45deg)" : "none"};
`;

const BlankText = styled(ButtonText)`
    color: ${props => props.isActive ? "white" : "#555555"};
`;

const HelpIcon = styled(ButtonIcon)`
    height: 16px;
    width: 16px;
`;

const DropdownChevron = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 7px;
    &:hover {
        cursor: pointer;
    }
`;

const ChevronIcon = styled.img`
    height: 10px;
    width: 10px;
`;

const EraserDropdown = styled.ul`
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: column;
    top: 100px;
    left: 100px;
    background-color: white;
    list-style-type: none;
    position: fixed;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	display: ${props => props.isActive? "flex" : "none"};
`;

const EraserOption = styled.li`
    position: relative;
    padding: 11px 15px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
        cursor: pointer;
        background-color: rgba(0,0,0,0.1);
    }
`;

const OptionIcon = styled.img`
    height: 16px;
    width: 16px;
    margin-right: 10px;
    transform: ${props => props.rotate === "true" ? "rotate(45deg)" : "none"};
`;

const OptionText = styled.p`
    font-size: 11px;
`;

const OptionActiveIndicator = styled.div`
    height: 100%;
    width: 5px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${props => props.isActive ? "#a7d8ff" : "transparent"};
`;

const Tooltip = styled.div`
    position: absolute;
    max-width: 200px;
    border-radius: 6px;
    padding: 15px;
    background-color: #FFF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 2;
    top: 0;
    left: 0;
    &:before {
        content: "";
        top: -5px;
        left: calc(50% - 5px);
        position: absolute;
        width: 0; 
        height: 0; 
        border-left: 5px solid #000;
        border-right: 5px solid #000;
        border-bottom: 5px solid #FFF;
        background-color: #FFF;
    }
`;

const TooltipButton = styled.button`
    border: none;
    border-radius: 14px;
    background-color: #a7d8ff;
    font-weight: bold;
    font-size: 13px;
    padding: 5px 10px;
    margin-top: 10px;
    width: 70px;
    flex-shrink: 1;
    height: 30px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.5);
    &:hover {
        cursor: pointer;
    }
    &:active {
        box-shadow: 0 1px 1px 0 rgba(0,0,0,0.5);
    }
    &:focus {
        outline: none;
    }
`;

const Overlay = styled.div`
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: rgb(0,0,0);
    transition: opacity 300ms ease-in-out;
    opacity: 0.7;
`;

export default CreateNav;