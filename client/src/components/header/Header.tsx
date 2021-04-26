import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import streamerIcon from './images/streamerIcon.png';
import { isMobile } from "react-device-detect";

function Header(): JSX.Element {
    return (
        <Link to="/">
            <header className={isMobile ? "header-mobile " : "header"}>
                <h1>Music
                <img className="headerImg" src={streamerIcon} alt="Music Player" />
                    Player
                </h1>
            </header>
        </Link>
    )
}

export default Header