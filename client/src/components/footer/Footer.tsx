import React from 'react';
import './Footer.css';

//icons
import facebookIcon from './images/facebookIcon.png';
import githubIcon from './images/githubIcon.png';
import linkedinIcon from './images/linkedinIcon.png';

function Footer(): JSX.Element {
    return (
        <footer>
            <div className="ul">
                <a href="https://www.facebook.com/guy.leifer" target="_blank">
                    <div className="li">
                        <img className="Icon circle" src={facebookIcon} alt="Facebook" />
                    </div>
                </a>
                <a href="https://github.com/GuyLeifer" target="_blank">
                    <div className="li">
                        <img className="Icon circle" src={githubIcon} alt="Github" />
                        <div className="name">
                            © Guy Leifer
                        </div>
                    </div>
                </a>
                <a href="https://www.linkedin.com/in/guy-leifer-a7036a1b6/" target="_blank">
                    <div className="li">
                        <img className="Icon" src={linkedinIcon} alt="LinkedIn" />
                    </div>
                </a>
            </div>
        </footer>
    )
}

export default Footer