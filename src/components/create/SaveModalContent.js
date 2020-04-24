import React from 'react';
import styled from 'styled-components';

const SaveModalContent = ({puzzleName, handleModalSaveClick}) => {
    const [name, setName] = React.useState("");

    React.useEffect(() => {
        setName(puzzleName || "");
    }, [puzzleName]);

    return (
        <StyledSaveModalContent>
            <Header> Give your puzzle a name! </Header>
            <FormWrapper>
                <Input 
                    type="text"
                    placeholder='"My crossword puzzle"'
                    value={name}
                    onChange={(e) => setName(e.target.value)} />

                <SaveButton type="submit" onClick={() => handleModalSaveClick(name)}> Save </SaveButton>
            </FormWrapper>
        </StyledSaveModalContent>
    );
}

const StyledSaveModalContent = styled.div`
    padding: 10px 20px;
    margin-bottom: 10px;
`;

const FormWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const Header = styled.p`
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 7px;
    border-radius: 3px;
    outline: none;
    border: 1px solid grey;
    font-size: 15px;
    margin-right: 10px;
    min-width: 200px;
    line-height: 17px;
`;

const SaveButton = styled.button`
    border: none;
    border-radius: 14px;
    background-color: #a7d8ff;
    font-weight: bold;
    font-size: 13px;
    padding: 5px 10px;
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

export default SaveModalContent;