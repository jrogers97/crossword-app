import React, {useEffect} from 'react';
import styled from 'styled-components';
import LoadModalContent from './LoadModalContent';
import SaveModalContent from './SaveModalContent';
import PrintModalContent from './PrintModalContent';
import xIcon from '../../icon/x.svg';

const CreateModal = ({
    grid,
    labels,
	clues,
    saveModalOpen, 
    loadModalOpen, 
    printModalOpen,
    handleModalClose, 
    handleSaveClick, 
    handleLoadClick, 
    handlePuzzleDeleteClick,
    puzzleName, 
    savedPuzzles
}) => {
    useEffect(() => {
        const handleClick = (e) => {
            if (e.target.id === "modal-overlay") {
                handleModalClose();
            }
        }
        window.addEventListener("click", handleClick);
        // cleanup
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <ModalOverlay hidden={!saveModalOpen && !loadModalOpen && !printModalOpen} id="modal-overlay">
            <ModalContent>
                <ModalCloseButton onClick={handleModalClose}>
                    <ModalCloseIcon src={xIcon} alt="Close" />
                </ModalCloseButton>
                
                {saveModalOpen && 
                    <SaveModalContent 
                        puzzleName={puzzleName}
                        handleSaveClick={handleSaveClick} />
                }

                {loadModalOpen && 
                    <LoadModalContent 
                        puzzleName={puzzleName}
                        savedPuzzles={savedPuzzles}
                        handleLoadClick={handleLoadClick}
                        handleDeleteClick={handlePuzzleDeleteClick} />
                }

                {printModalOpen &&
                    <PrintModalContent
                        grid={grid}
                        labels={labels}
                        clues={clues}
                        puzzleName={puzzleName}
                        handleModalClose={handleModalClose} />
                }
            </ModalContent>
        </ModalOverlay>
    );
}

const ModalOverlay = styled.div`
    align-items: center;
    justify-content: center;
	position: absolute;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	z-index: 1;
	top: 0;
	left: 0;
	background-color: rgba(255,255,255,0.5);
	display: ${props => props.hidden ? "none" : "flex"};
`;

const ModalContent = styled.div`
	position: absolute;
	background-color: white;
	box-shadow: 0px 2px 4px 0 rgba(0,0,0,0.5);
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	padding: 20px;
`;

const ModalCloseButton = styled.button`
    font-size: 15px;
    font-weight: bold;
    background-color: transparent;
    border: none;
    align-self: flex-end;
    outline: none;
    &:hover {
        cursor: pointer;
    }
`;

const ModalCloseIcon = styled.img`
    height: 11px;
    width: 11px;
`;

export default CreateModal;