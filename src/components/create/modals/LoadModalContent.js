import React from 'react';
import styled from 'styled-components';
import trashIcon from '../../../icon/trash.svg';

const LoadModalContent = ({puzzleName, savedPuzzles, handleLoadClick, handleDeleteClick}) => {
    return (
        <StyledLoadModalContent>
            <Header> Your puzzles </Header>
            <PuzzleList>
                {Object.keys(savedPuzzles).reverse().map((name, idx) => {
                    return (
                        name !== puzzleName &&
                            <PuzzleListItem key={idx} onClick={() => handleLoadClick(name)}>
                                <PuzzleInfo>
                                    <PuzzleName> {name} </PuzzleName>
                                    <DateCreated> {"Created " + savedPuzzles[name].dateCreated || ""} </DateCreated>
                                </PuzzleInfo>
                                <Button onClick={(e) => {
                                    handleDeleteClick(name);
                                    e.stopPropagation();
                                }}>
                                    <Icon src={trashIcon} />
                                </Button>
                            </PuzzleListItem>
                    )
                })}
            </PuzzleList>
        </StyledLoadModalContent>
    );
}

const StyledLoadModalContent = styled.div`
    padding: 10px 20px;
    margin-bottom: 10px;
`;

const Header = styled.p`
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
`;

const PuzzleList = styled.ul`
    display: flex;
    flex-direction: column;
    list-style-type: none;
    max-height: 380px;
    overflow-y: scroll;
`;

const PuzzleListItem = styled.li`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #CCC;
    &:hover {
        background-color: #EEE;
        cursor: pointer;
    }
    &:last-child {
        border-bottom: none;
    }
`;

const PuzzleInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 300px;
`;

const PuzzleName = styled.span`
    margin-right: auto;
    font-weight: bold;
`;

const DateCreated = styled.span`
    font-size: 12px;
    opacity: 0.8
`;

const Button = styled.button`
    margin-left: 80px;
    border: none;
    background-color: transparent;
    &:hover {
        cursor: pointer;
    }
    &:focus {
        outline: none;
    }
`;

const Icon = styled.img`
    height: 18px;
    width: 18px;
    opacity: 0.5;
    &:hover {
        opacity: 0.9;
    }
`;

export default LoadModalContent;