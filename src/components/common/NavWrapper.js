import React from 'react';
import SolveNav from '../solve/SolveNav';
import CreateNav from '../create/CreateNav';
import styled from 'styled-components';
import menuIcon from '../../icon/menu.svg';

export const NavWrapper = (props) => {
    return (
        <StyledNavWrapper>
            <Menu onClick={props.toggleSidebarOpen}>
                <MenuIcon src={menuIcon} alt="Menu" id="menu"/>
            </Menu>

            { props.mode === "solve" && <SolveNav {...props} /> } 
            { props.mode === "create" && <CreateNav {...props} /> }
        </StyledNavWrapper>
    );
}

const StyledNavWrapper = styled.div`
    width: 100%;
    height: 100%;
	border-bottom: 1px solid rgba(0,0,0,0.2);
	display: flex;
    align-items: center;
    @media (max-width: 700px) {
        font-size: 13px;
    }
`;

const Menu = styled.button`
    border: none;
    margin: 0 20px;
    &:hover {
        cursor: pointer;
    }
    &:focus {
        outline: none;
    }
`;

const MenuIcon = styled.img`
    height: 20px;
    width: 20px;
    border: none;
`;