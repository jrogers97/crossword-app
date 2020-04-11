import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Solve from './solve/Solve';
import Create from './create/Create';
import Sidebar from './common/Sidebar';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sidebarOpen: false,
            activePage: "solve"
        };

        this.toggleSidebarOpen = this.toggleSidebarOpen.bind(this);
        this.changeActivePage = this.changeActivePage.bind(this);
    }

    toggleSidebarOpen(e) {
        this.setState({sidebarOpen: !this.state.sidebarOpen});
    }

    // change active page and close sidebar
    changeActivePage(pageName) {
        this.setState({
            activePage: pageName,
            sidebarOpen: false
        });
    }

    render() {
        return (
            <Router>
                <Sidebar 
                    open={this.state.sidebarOpen}
                    activePage={this.state.activePage}
                    toggleSidebarOpen={this.toggleSidebarOpen} 
                    changeActivePage={this.changeActivePage} />

                <Switch>
                    <Route path="/solve">
                        <Solve 
                            toggleSidebarOpen={this.toggleSidebarOpen}
                            changeActivePage={this.changeActivePage} />
                    </Route>

                    <Route path="/create">
                        <Create 
                            toggleSidebarOpen={this.toggleSidebarOpen}
                            changeActivePage={this.changeActivePage} />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;