import React, {Component} from 'react';
import {formatTime} from '../../util/utilities';
import pauseIcon from '../../icon/pause.svg';
import styled from 'styled-components';
// import './styles/Timer.css';

class Timer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: this.props.value || 0
        };
    }

    componentDidMount() {
        this.runTimer(this.props.finished, this.props.correct);
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.value && this.props.value) {
            this.setState({time: this.props.value});
        }
    }

    runTimer() {
        let finishedAndCorrectFlag;
        let hasStartedFlag;
		this.intervalId = setInterval(() => {
			if (this.props.finished && this.props.correct) {
                finishedAndCorrectFlag = true;
            }
            
            if (this.props.hasStarted) {
                hasStartedFlag = true;
            }

			// if user starts a new puzzle, reset flag and timer
			if ((finishedAndCorrectFlag && !this.props.finished) || (hasStartedFlag && !this.props.hasStarted)) {
                finishedAndCorrectFlag = false;
                hasStartedFlag = false;
				this.setState({time: 0});
			} else if (!this.props.paused && this.props.hasStarted && !(this.props.finished && this.props.correct)) {
				this.setState({time: this.state.time + 1});
			}
        }, 1000);
    }

    render() {
        return (
            <StyledTimer>
                <span> {formatTime(this.state.time)} </span>

                <PauseButton onClick={() => this.props.handleTimerPause(this.state.time)}>
                    <PauseIcon src={pauseIcon} alt="Pause"/>
                </PauseButton> 
            </StyledTimer>
        );
    }
}

const StyledTimer = styled.div`
    display: flex;
    align-items: center;
    margin-right: 10px;
    @media(max-width: 700px) {
        margin-right: 0;
    }
`;

const PauseButton = styled.button`
    border: none;
    background-color: transparent;
    height: 16px;
    width: 16px;
    margin-left: 5px;
    &:hover {
        cursor: pointer;
    }
    &:focus {
        outline: none;
    }
`;

const PauseIcon = styled.img`
    height: 100%;
	width: 100%;
    fill: #DCEFFE;

`;

export default Timer;