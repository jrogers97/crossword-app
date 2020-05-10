import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

const SaveModalContent = ({puzzleName, handleSaveClick}) => {
    const [name, setName] = useState("");
    const [invalidName, setInvalidName] = useState(false);

    const validateName = (e) => {
        e.preventDefault();
        if (name === "") {
            setInvalidName(true);
        } else {
            handleSaveClick(name, false);
        }
    }

    useEffect(() => {
        setName(puzzleName || "");
    }, [puzzleName]);

    return (
        <StyledSaveModalContent>
            <Header> Give your puzzle a name! </Header>
            <FormWrapper onSubmit={validateName}>
                <InputWrapper>
                    <Input 
                        type="text"
                        placeholder='"My crossword puzzle"'
                        value={name}
                        onChange={(e) => setName(e.target.value)} />

                    {invalidName && <Warning> Your puzzle needs a name </Warning>}
                </InputWrapper>
                <SaveButton type="submit"> Save </SaveButton>
            </FormWrapper>
        </StyledSaveModalContent>
    );
}

const StyledSaveModalContent = styled.div`
    padding: 10px 20px;
    margin-bottom: 10px;
`;

const FormWrapper = styled.form`
    display: flex;
    align-items: flex-start;
`;

const Header = styled.p`
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
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

const Warning = styled.span`
    color: #da3849;
    font-size: 13px;
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