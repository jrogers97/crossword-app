import React, {Component} from 'react';
import './styles/CreateNav.css';
import eraserIcon from '../../icon/eraser.svg';

class CreateNav extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.blankButton = document.querySelector(".NavBar-Blank");
    }

    handleNavButtonClick(e) {
        this.blankButton.classList.toggle("active-blank");
    }

    render() {
        return (
            <button className="NavBar-Blank" onClick={(e) => {
                this.handleNavButtonClick(e);
                this.props.handleBlankClick(e);
            }}>
                <img src={eraserIcon} alt="Notes" className="NavBar-BlankIcon"/>
            </button>
        );
    }
}

export default CreateNav;