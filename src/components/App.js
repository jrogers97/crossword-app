import React, {useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {createBrowserHistory} from 'history';
import styled from 'styled-components';
import Solve from './solve/Solve';
import Create from './create/Create';
import Sidebar from './common/Sidebar';
import FrontDoor from './common/FrontDoor';

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("");

    const toggleSidebarOpen = () => setSidebarOpen(!sidebarOpen);
    const changeActivePage = (pageName) => {
        setActivePage(pageName);
        setSidebarOpen(false);
    }

    const history = createBrowserHistory({
        basename: process.env.PUBLIC_URL
    })

    return (
        <Router history={history}>
            {activePage !== "" &&
                <Sidebar 
                    open={sidebarOpen}
                    activePage={activePage}
                    toggleSidebarOpen={toggleSidebarOpen} 
                    changeActivePage={changeActivePage} />
            }

            <Switch>
                <Route exact path="/">
                    <FrontDoor />
                </Route>

                <Route path="/solve">
                    <Solve 
                        toggleSidebarOpen={toggleSidebarOpen}
                        changeActivePage={changeActivePage} />
                </Route>

                <Route path="/create">
                    <Create 
                        toggleSidebarOpen={toggleSidebarOpen}
                        changeActivePage={changeActivePage} />
                </Route>
            </Switch>

            <SmallScreenWarning>
                Sorry! This site doesn't work on small screens. Try it out on a computer!
            </SmallScreenWarning>
        </Router>
    );
}

const SmallScreenWarning = styled.div`
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    min-height: 400px;
    min-width: 400px;
    background-color: white;
    padding: 20px;
    @media (max-width: 400px) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export default App;