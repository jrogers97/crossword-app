import React from 'react';
import styled from 'styled-components';
import pencilIcon from '../../icon/pencil-grey.svg';

const PuzzleHeader = ({puzzleName, handleEditClick}) => {
    return (
        <StyledPuzzleHeader hidden={!puzzleName}>
            <PuzzleName>{puzzleName}</PuzzleName>
            <EditButton onClick={() => handleEditClick(null, true)}>
                <EditIcon src={pencilIcon} />
            </EditButton>
        </StyledPuzzleHeader>
    );
}

const StyledPuzzleHeader = styled.div`
    display: ${props => props.hidden ? "none" : "flex"};
    padding: 10px 0 0 3px;
`;

const PuzzleName = styled.div`
    font-weight: bold;
    font-size: 20px;
    margin-right: 15px;
`;

const EditButton = styled.button`
    margin-top: 2px;
    border: none;
    &:focus {
        outline: none;
    }
    &:hover {
        cursor: pointer;
    }
`;

const EditIcon = styled.img`
    height: 14px;
    width: 14px;
`;

export default PuzzleHeader;