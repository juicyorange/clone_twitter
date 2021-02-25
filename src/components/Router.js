import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// Switch 는 한번에 한 라우터만 보여주도록 한다.
import Auth from '../routes/Auth';
import Home from '../routes/Home';


const AppRouter = ({ isLoggedIn }) => {

    return (
        <Router>
            <Switch>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/">
                            <Home />
                        </Route>
                    </>) : (
                        <Route exact path="/">
                            <Auth />
                        </Route>)}
            </Switch>
        </Router>
    )
}

export default AppRouter;