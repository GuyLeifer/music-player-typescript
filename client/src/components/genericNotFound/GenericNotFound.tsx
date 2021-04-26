import React from 'react';
import './GenericNotFound.css';
import { Link } from 'react-router-dom';
import fofIcon from './images/404Icon.png';
import homeIcon from './images/homeIcon.jpg';

function GenericNotFound(): JSX.Element {
    return (
        <div className="four0four">
            <img src={fofIcon} alt="404" />
            <Link to="/">
                <div className="home">Go Home
                    <div>
                        <img className="homeLogo" src={homeIcon} alt="Home" />
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default GenericNotFound