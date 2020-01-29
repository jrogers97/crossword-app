import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './styles/Sidebar.css';

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {open: true}

        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    toggleSidebar(e) {
        this.setState({open: !this.state.open});
    }

    render() {
        return (
            <div className={"Sidebar-Container " + (!this.state.open ? "hidden" : "")}>
                <Link to="/solve"> Solve </Link>
                <Link to="/create"> Create </Link>

                <button className="Sidebar-Close" onClick={this.toggleSidebar}>x</button>
            </div>
        );
    }
}

export default Sidebar;