import React from 'react';
// import './styles/CreateNav.css';
import styled from 'styled-components';
import eraserIcon from '../../icon/eraser.svg';
import saveIcon from '../../icon/save.svg';
import loadIcon from '../../icon/load.svg';

// class CreateNav extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {blankButtonActive: false};
//     }

//     handleNavButtonClick(e) {
//         this.setState({blankButtonActive: !this.state.blankButtonActive});
//     }

//     render() {
//         return (
//             <ButtonSet>
//                 <BlankButton
//                     isActive={this.state.blankButtonActive}
//                     onClick={(e) => {
//                         this.handleNavButtonClick(e);
//                         this.props.handleBlankClick(e);
//                     }}>
//                     <BlankIcon 
//                         src={eraserIcon}
//                         isActive={this.state.blankButtonActive}
//                         alt="Eraser" />

//                     <BlankText isActive={this.state.blankButtonActive}> Eraser </BlankText>
//                 </BlankButton>

//                 <Button
//                     onClick={this.props.handleLoadClick}>
//                     <ButtonIcon 
//                         src={loadIcon}
//                         alt="Load Puzzle" />
//                     <ButtonText> Load </ButtonText>
//                 </Button>

//                 <Button
//                     onClick={this.props.handleSaveClick}>
//                     <ButtonIcon
//                         src={saveIcon}
//                         alt="Save Puzzle" />
//                     <ButtonText> Save </ButtonText>
//                 </Button>
//             </ButtonSet>
//         );
//     }
// }

const CreateNav = ({
    handleBlankClick,
    handleLoadClick,
    handleSaveClick
}) => {
    const [blankButtonActive, setBlankButtonActive] = React.useState(false);

    const handleBlankButtonClick = (e) => setBlankButtonActive(!blankButtonActive);

    return (
        <ButtonSet>
            <BlankButton
                isActive={blankButtonActive}
                onClick={(e) => {
                    handleBlankButtonClick(e);
                    handleBlankClick(e);
                }}>
                <BlankIcon 
                    src={eraserIcon}
                    isActive={blankButtonActive}
                    alt="Eraser" />

                <BlankText isActive={blankButtonActive}> Eraser </BlankText>
            </BlankButton>

            <Button
                onClick={handleLoadClick}>
                <ButtonIcon 
                    src={loadIcon}
                    alt="Load Puzzle" />
                <ButtonText> Load </ButtonText>
            </Button>

            <Button
                onClick={handleSaveClick}>
                <ButtonIcon
                    src={saveIcon}
                    alt="Save Puzzle" />
                <ButtonText> Save </ButtonText>
            </Button>
        </ButtonSet>
    );
}

const ButtonSet = styled.div`
    margin: 0 20px 0 auto;
`;

const Button = styled.button`
    border: none;
    height: 44px;
    padding: 1px 20px;
    &:hover {
        cursor: pointer;
    }
    &:focus {
        outline: none;
    }
`;

const ButtonIcon = styled.img`
    height: 20px;
    width: 20px;
    vertical-align: middle;
    &:hover {
        cursor: pointer;
    }
`;

const ButtonText = styled.p`
    text-align: center;
`;

const BlankButton = styled(({isActive, ...rest}) => <Button {...rest} />)`
    background-color: ${props => props.isActive ? "#4F85E5" : "transparent"};
`;

const BlankIcon = styled(({isActive, ...rest}) => <ButtonIcon {...rest} />)`
    filter: ${props => props.isActive ? "invert(1)" : "initial"};
`;

const BlankText = styled(({isActive, ...rest}) => <ButtonText {...rest} />)`
    color: ${props => props.isActive ? "white" : "black"};
`;

export default CreateNav;