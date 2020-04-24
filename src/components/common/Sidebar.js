import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import notesIcon from '../../icon/pencil.svg';
import plusIcon from '../../icon/plus.svg';
import xIcon from '../../icon/x.svg';

// class Sidebar extends Component {
//     constructor(props) {
//         super(props);

        // this.handleClick = this.handleClick.bind(this);
    // }

    // componentDidMount() {
    //     window.addEventListener("click", this.handleClick);
    // }

    // componentWillUnmount() {
    //     window.removeEventListener("click", this.handleClick);
    // }

    // handleClick(e) {
    //     if (this.props.open && e.target.id !== "menu" && e.target.id !== "sidebar-container") {
    //         this.props.toggleSidebarOpen(e);
    //     }
    // }

    // isActive(name) {
    //     return this.props.activePage === name;
    // }

//     render() {
//         const pages = [
//             ["/solve", "Solve", notesIcon, this.isActive("solve")], 
//             ["/create", "Create", plusIcon, this.isActive("create")]
//         ];

//         return (
//             <React.Fragment>
//                 <SidebarContainer open={this.props.open} id="sidebar-container">
//                     <SidebarClose onClick={this.props.toggleSidebarOpen}>
//                         <SidebarCloseIcon src={xIcon} alt="Close"/>
//                     </SidebarClose>

//                     {pages.map(([path, name, icon, isActive]) => {
//                         return (
//                             <LinkItem 
//                                 to={path} 
//                                 key={name}
//                                 isActive={isActive}
//                                 onClick={() => this.props.changeActivePage(name.toLowerCase())}>
//                                     <LinkItemActiveIndicator isActive={isActive}></LinkItemActiveIndicator> 
//                                     <LinkItemIcon src={icon} alt={name} />
//                                     <p> {name} </p>
//                             </LinkItem>
//                         )
//                     })}
//                 </SidebarContainer>

//                 <Overlay open={this.props.open}></Overlay>
//             </React.Fragment>
//         );
//     }
// }

const Sidebar = ({
    open,
    activePage,
    toggleSidebarOpen,
    changeActivePage
}) => {
    React.useEffect(() => {
        const handler = (e) => {
            if (open && e.target.id !== "menu" && e.target.id !== "sidebar-container") {
                toggleSidebarOpen(e);
            }
        };

        window.addEventListener("click", handler);

        // clean up
        return () => window.removeEventListener("click", handler);
    }, [open]);

    const pages = [
        ["/solve", "Solve", notesIcon, activePage === "solve"], 
        ["/create", "Create", plusIcon, activePage === "create"]
    ];

    return (
        <React.Fragment>
            <SidebarContainer open={open} id="sidebar-container">
                <SidebarClose onClick={toggleSidebarOpen}>
                    <SidebarCloseIcon src={xIcon} alt="Close"/>
                </SidebarClose>

                {pages.map(([path, name, icon, isActive]) => {
                    return (
                        <LinkItem 
                            to={path} 
                            key={name}
                            isActive={isActive}
                            onClick={() => changeActivePage(name.toLowerCase())}>
                                <LinkItemActiveIndicator isActive={isActive}></LinkItemActiveIndicator> 
                                <LinkItemIcon src={icon} alt={name} />
                                <p> {name} </p>
                        </LinkItem>
                    )
                })}
            </SidebarContainer>

            <Overlay open={open}></Overlay>
        </React.Fragment>
    );
}

const SidebarContainer = styled.div`
    height: 100vh;
    width: 200px;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 3;
    background-color: rgb(250, 250, 250);
    transition: left 200ms ease-in-out;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    box-shadow: ${props => props.open ? "2px 0 5px 1px rgba(0,0,0,0.4)" : "none"};
    left: ${props => props.open ? "0" : "-200px"};
`;

const SidebarClose = styled.button`
    font-size: 15px;
    font-weight: bold;
    margin: 10px 15px;
    background-color: transparent;
    border: none;
    align-self: flex-end;
    outline: none;
    &:hover {
        cursor: pointer;
    }
`;

const SidebarCloseIcon = styled.img`
    height: 11px;
    width: 11px;
`;

const LinkItem = styled(({isActive, ...rest}) => <Link {...rest}/>)`
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    border-radius: 2px;
    text-decoration: none;
    color: rgba(0,0,0,0.8);
    &:hover {
        background-color: rgba(100,100,100,0.1);
    }
`;

const LinkItemActiveIndicator = styled.span`
    width: 10px;
    height: 100%;
    background-color: ${props => props.isActive ? "#a7d8ff" : "transparent"};
`;

const LinkItemIcon = styled.img`
    height: 15px;
    width: 15px;
    margin: 20px;
    fill: rgba(236, 59, 59, 0.5);
`;

const Overlay = styled.div`
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    background-color: rgba(0,0,0);
    transition: visibility 0s, opacity 300ms ease-in-out;
    opacity: ${props => props.open ? "0.8" : "0"};
    visibility: ${props => props.open ? "visible" : "hidden"};
`;

export default Sidebar;