import React from 'react';
import styled from 'styled-components';
import pencilIcon from '../../icon/pencil-grey.svg';

const PuzzleHeader = ({puzzleName, gridSize, handleEditClick, handleGridSizeChange}) => {
    const gridSizes = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
    return (
        <StyledPuzzleHeader>
            <NameSection hidden={!puzzleName}>
                <PuzzleName>{puzzleName}</PuzzleName>
                <EditButton onClick={() => handleEditClick(null, true)}>
                    <EditIcon src={pencilIcon} />
                </EditButton>
            </NameSection>
            <SizeDropdown defaultValue={gridSize} onChange={handleGridSizeChange}>
                {gridSizes.map(size => 
                    <SizeOption 
                        key={size}
                        value={size}>
                        {size}x{size}
                    </SizeOption>
                )}
            </SizeDropdown>
        </StyledPuzzleHeader>
    );
}

const StyledPuzzleHeader = styled.div`
    display: flex;
    padding: 10px 0 0 3px;
`;

const NameSection = styled.div`
    display: ${props => props.hidden ? "none" : "flex"};
    flex-grow: 1;
`;

const PuzzleName = styled.div`
    font-weight: bold;
    font-size: 20px;
    margin-right: 15px;
`;

const EditButton = styled.button`
    margin: 2px 10px 0 0;
    border: none;
    background-color: transparent;
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

const SizeDropdown = styled.select`
    font-size: 14px;
    &:focus {
        outline: none;
    }
`;

const SizeOption = styled.option`
    font-size: 14px;
`;

export default PuzzleHeader;