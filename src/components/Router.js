import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// Switch 는 한번에 한 라우터만 보여주도록 한다.
import Auth from '../routes/Auth';
import Home from '../routes/Home'
import Profile from "../routes/Profile";
import Navigation from 'components/Navigation';



const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {

    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Switch>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/">
                            <Home userObj={userObj} />
                        </Route>
                        <Route exact path="/profile">
                            <Profile userObj={userObj} refreshUser={refreshUser} />
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