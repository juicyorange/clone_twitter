import React from "react";
import { Link } from "react-router-dom";
import Profile from '../routes/Profile';

const Navigation = ({ userObj }) => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/" >Home</Link>
                </li>
                <li>
                    <Link to="/profile">{userObj.displayName ? userObj.displayName : userObj.email} Profile</Link>
                    {userObj.photoURL &&
                        <div>
                            <img src={userObj.photoURL} width="50px" height="50px" />
                        </div>
                    }
                </li>
            </ul>
        </nav>
    )
}

export default Navigation;
