import React, {Component} from 'react';
import {formatTime} from '../../util/utilities';
import pauseIcon from '../../pause.svg';
import './styles/Timer.css';

class Timer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: this.props.value || 0
        };
    }

    componentDidMount() {
        this.runTimer(this.props.finished, this.props.correct);

        // pause game before page close and save state to local storage 
		window.addEventListener('beforeunload', e => {
            e.preventDefault();
			this.props.handleTimerPause(this.state.time);
			this.props.onPageUnload();
		});
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.value && this.props.value) {
            this.setState({time: this.props.value});
        }
    }

    runTimer() {
        let finishedAndCorrectFlag;
        let hasStartedFlag;
		setInterval(() => {
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
            <div className="Timer">
                <span className="Timer-Text">
                    {formatTime(this.state.time)}
                </span>

                <button 
                    className="Timer-Pause" 
                    onClick={() => this.props.handleTimerPause(this.state.time)}>
                    
                    <img src={pauseIcon} alt="Pause" className="Timer-PauseIcon" />
                </button> 
            </div>
        );
    }
}

export default Timer;