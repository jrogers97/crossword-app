import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Solve from './solve/Solve';
import Create from './create/Create';
import Sidebar from './common/Sidebar';

const App = () => {
    return (
        <Router>
            <Sidebar />

            <Switch>
                <Route path="/solve">
                    <Solve />
                </Route>

                <Route path="/create">
                    <Create />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;