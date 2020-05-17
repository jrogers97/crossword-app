import React, {useState, useEffect} from 'react';
import {formatTime} from '../../util/utilities';
import pauseIcon from '../../icon/pause.svg';
import styled from 'styled-components';

const Timer = ({
    value,
    correct,
    hasStarted,
    paused,
    finished,
    timerRef,
    handleTimerPause,
    handleTimerUpdate
}) => {
    const [time, setTime] = useState(value);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        setIsRunning(!paused && !correct && hasStarted);
        // pass time back up to Solve so Modal can use the current timer value
        handleTimerUpdate(time);
        // eslint-disable-next-line
    }, [paused, correct, hasStarted, finished]);

    useEffect(() => {
        setTime(value);
    }, [value])

    useEffect(() => {
        if (isRunning) {
            const intervalId = setInterval(() => {
                setTime(seconds => seconds + 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [isRunning]);

    useEffect(() => {
        timerRef.current = time;
    }, [time, timerRef]);

    return (
        <StyledTimer>
            <span> {formatTime(time)} </span>
            <PauseButton onClick={() => handleTimerPause()}>
                <PauseIcon src={pauseIcon} alt="Pause"/>
            </PauseButton> 
        </StyledTimer>
    );
};

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