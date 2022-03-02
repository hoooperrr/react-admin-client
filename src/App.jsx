import './App.less';
import React, {Component, Fragment} from "react";
import {Route, Switch} from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

class App extends Component {
    render() {
        return (
            <Fragment>
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/' component={Admin}/>
                </Switch>
            </Fragment>
        );
    }
}

export default App;
