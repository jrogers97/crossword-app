import React from 'react';
import SolveNav from '../solve/SolveNav';
import CreateNav from '../create/CreateNav';
import './styles/NavWrapper.css';
import menuIcon from '../../icon/menu.svg';

export const NavWrapper = (props) => {
    return (
        <div className="NavWrapper">
            <button	className="NavWrapper-Menu" onClick={props.toggleSidebarOpen}>
                <img src={menuIcon} className="NavWrapper-MenuIcon" alt="Menu"/>
            </button>

        { props.mode === "solve" && <SolveNav {...props} /> } 
        { props.mode === "create" && <CreateNav {...props} /> }
        </div>
    );
}