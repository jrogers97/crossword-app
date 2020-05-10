import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import notesIcon from '../../icon/pencil.svg';
import plusIcon from '../../icon/plus.svg';

const FrontDoor = () => {
    return (
        <StyledFrontDoor>
            <CenterRail>
                <Header>Get Ready to Cross Those Words</Header>
                <Links>
                    <StyledLink to={"/solve"}>
                        <LinkItem>
                            <Icon src={notesIcon} />
                            <Text>Solve</Text>
                            <Subtext>Work on New York Times puzzles from throughout history!</Subtext>
                        </LinkItem>
                    </StyledLink>

                    <StyledLink to={"/create"}>
                        <LinkItem>
                            <Icon src={plusIcon} />
                            <Text>Create</Text>
                            <Subtext>Make and download your very own puzzle!</Subtext>
                        </LinkItem>
                    </StyledLink>
                </Links>
            </CenterRail>
        </StyledFrontDoor>
    );
}

const StyledFrontDoor = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
`;

const CenterRail = styled.div`
    width: 50%;
    min-width: 520px;
    @media(max-width: 1100px) {
        width: 60%;
    }
    @media(max-width: 900px) {
        width: 70%;
    }
`;

const Header = styled.p`
    font-weight: bold;
    font-size: 40px;
    margin-bottom: 80px;
    width: 50%;
    min-width: 520px;
    @media(max-width: 1100px) {
        width: 60%;
    }
    @media(max-width: 900px) {
        width: 70%;
    }
`;

const Links = styled.div`
    display: flex;
    justify-content: space-between;
`;


const LinkItem = styled.div`
    height: 300px;
    width: 250px;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 2px 3px 2px rgba(0,0,0,0.2);
    transition: box-shadow 200ms ease-out;
    &:hover {
        box-shadow: 0px 3px 4px 2px rgba(0,0,0,0.4);
    }
`;

const Icon = styled.img`
    height: 40px;
    width: 40px;
    margin-top: 50px;
`;

const Text = styled.p`
    font-weight: bold;
    font-size: 30px;
    text-decoration: none;
    margin-top: 30px;
    color: #444;
`;

const Subtext = styled.p`
    font-size: 16px;
    text-align: center;
    padding: 20px;
    margin-top: 20px;
    color: #666;
`;

export default FrontDoor;