import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './styles/Sidebar.css';
import notesIcon from '../../icon/pencil.svg';
import plusIcon from '../../icon/plus.svg';
import xIcon from '../../icon/x.svg';

class Sidebar extends Component {
    componentDidMount() {
        window.addEventListener("click", (e) => {
            if (this.props.open) {
                if (e.target.classList.value.indexOf("Sidebar") === -1
                    && e.target.classList.value.indexOf("Menu") === -1) {
                    this.props.toggleSidebarOpen();
                }
            }
        });
    }

    isActive(name) {
        return this.props.activePage === name;
    }

    render() {
        const pages = [
            ["/solve", "Solve", notesIcon, this.isActive("solve")], 
            ["/create", "Create", plusIcon, this.isActive("create")]
        ];

        return (
            <React.Fragment>
            <div className={"Sidebar-Container " + (!this.props.open ? "hidden-sidebar" : "")}>
                <button className="Sidebar-Close" onClick={this.props.toggleSidebarOpen}>
                    <img src={xIcon} className="Sidebar-XIcon" alt="Close"/>
                </button>

                {pages.map(([path, name, icon, isActive]) => {
                    return (
                        <Link 
                            to={path} 
                            key={name}
                            className="Sidebar-Item" 
                            onClick={() => this.props.changeActivePage(name.toLowerCase())}>
                                <span className={isActive ? "Sidebar-ItemActive" : "Sidebar-ItemInactive"}></span> 
                                <img src={icon} alt={name} className="Sidebar-ItemIcon" />
                                <p className="Sidebar-ItemText"> {name} </p>
                        </Link>
                    )
                })}
            </div>

            <div className={"Overlay " + (!this.props.open ? "hidden-overlay" : "")}></div>
            </React.Fragment>
        );
    }
}

export default Sidebar;