import React, { useState, useEffect } from 'react';
import './Navbar.css';
import Searchbar from './Searchbar';

// packages
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { isMobile } from "react-device-detect";

//recoil
import { useRecoilState } from "recoil";
import { userState } from '../../Atoms/userState';

//icons
import youtubeIcon from './images/youtubeIcon.jpg';
import homeIcon from './images/homeIcon.png';
import aboutIcon from './images/aboutIcon.jpg';
import loginIcon from './images/loginIcon.webp';

// types
import { User as UserType } from '../../types/types';

// Modal issue
Modal.setAppElement('div');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-30%',
        transform: 'translate(-50%, -50%)',
        background: ' rgb(73, 79, 82)',
        color: 'white',
        borderRadius: '10%'
    }

};


function Navbar(): JSX.Element {
    const navStyle = {
        color: 'white'
    };
    // states
    const [logOutShown, setLogOutShown] = useState<boolean>(false);
    const [wantLogin, setWantLogin] = useState<boolean>(false);
    const [wantSign, setWantSign] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // recoil states
    const [user, setUser] = useRecoilState<UserType | null>(userState);

    const [loginError, setLoginError] = useState<string | null>();
    const [signupError, setSignupError] = useState<string | null>();
    const { register, handleSubmit, errors } = useForm(); // initialize the hook

    // verify user
    useEffect(() => {
        setSignupError(null);
        setLoginError(null);
    }, [])

    useEffect(() => {
        fetchUser();
    }, [wantLogin, wantSign])

    const fetchUser = async () => {
        const { data } = await axios.get('/api/v1/users/verify');
        data ? setUser(data.user) : setUser(null);
    };

    const onLoginSubmit = async (data: { email: string, password: string }) => {
        const { email, password } = data;
        const res = await axios.post('/api/v1/users/login', {
            email: email,
            password: password,
        })
        if (res.data.user) {
            if (res.data.user === 'Incorrect Password' || res.data.user === 'Incorrect Email') {
                setLoginError(res.data.user)
            } else {
                setLoading(true);
                setUser(res.data.user);
                setLoading(false);
                setWantLogin(false);
            }
        }
    };

    const logout = async () => {
        await axios.post('/api/v1/users/logout');
        setUser(null);
        setLogOutShown(false);
    }

    const wantLog = () => {
        setWantSign(false)
        setWantLogin(true)
    }

    const wantSignUp = () => {
        setWantLogin(false)
        setWantSign(true)
    }

    const onSignUpSubmit = async (data: { name: string, email: string, password: string }) => {
        setSignupError(null);
        const { name, email, password } = data;
        setLoading(true);
        const res = await axios.post('/api/v1/users/signup', {
            name: name,
            email: email,
            password: password,
        })
        if (res.data === "User Already Exists" || res.data === "Password Too Short") {
            setSignupError(res.data)
        } else {
            setTimeout(() => {
                setLoading(false);
                setWantSign(false);
            }, 2000)
            const info = await res.data;
            if (info.user) {
                setUser(info.user);
            }
        }
    };

    return (
        <nav className={isMobile ? "nav-mobile" : "nav"} onMouseLeave={() => setLogOutShown(false)}>
            { !isMobile ?
                <>
                    <div className="nav-titles">
                        <Link to={'/'}>
                            <img className="navImg" src={youtubeIcon} alt="YouTube Icon" />
                        </Link>
                        <h3 className="navH3">My Streamer</h3>
                        <div
                            style={{ width: 300, }}>
                            <Searchbar />
                        </div>
                    </div>

                    <ul className="nav-links">
                        <Link style={navStyle} to='/'>
                            <li><img className="navImg" src={homeIcon} alt="Home" /></li>
                        </Link>
                        <Link style={navStyle} to='/about'>
                            <li><img className="navImg" src={aboutIcon} alt="About" /></li>
                        </Link>

                        <div className='login'>
                            {user ? (
                                <div>
                                    <Link to={`/user/${user!.id}`}>
                                        <li className='username navImg'
                                            onMouseEnter={() => setLogOutShown(true)}
                                        >
                                            {user!.name! ?
                                                user!.name!.split(' ').map((name: string) => name[0])
                                                : null}
                                        </li>
                                    </Link>
                                    {logOutShown && (
                                        <li className="logout" onClick={logout}>(Log - Out)</li>
                                    )}
                                </div>
                            ) : null}

                            {!user && (
                                <li onClick={() => setWantLogin(!wantLogin)}><img className="navImg" src={loginIcon} alt="Login" /></li>
                            )}

                            <Modal
                                isOpen={wantLogin}
                                onRequestClose={() => setWantLogin(!wantLogin)}
                                style={customStyles}
                            >
                                <div className="modal">
                                    <h2 className="modalTitle">Log - In</h2>
                                    <form className="accountForm" onSubmit={handleSubmit(onLoginSubmit)}>
                                        <div className="labelInput">
                                            <label htmlFor="email">E-mail:</label>
                                            <input className="input" name="email" type="email" ref={register({ required: true })} placeholder="E-mail" />
                                            <div className="error">{errors.email && 'E-mail is required.'}</div>
                                        </div>
                                        <div className="labelInput">
                                            <label htmlFor="password">Password:</label>
                                            <input className="input" name="password" type="password" ref={register({ required: true })} placeholder="Password" />
                                            <div className="error">{errors.password && 'Please enter your password.'}</div>
                                        </div>
                                        {loginError && <div style={{ textAlign: 'center', color: 'red' }}>{loginError}</div>}
                                        <input className="input" type="submit" value="Login" />
                                    </form>
                                    <div className="signup">
                                        <p className="question">Does not have an account?</p>
                                        <h3 className="signupLink" onClick={() => wantSignUp()}>Sign - Up!</h3>
                                    </div>
                                </div>
                            </Modal>


                            <Modal
                                isOpen={wantSign}
                                onRequestClose={() => setWantSign(!wantSign)}
                                style={customStyles}
                            >
                                <div className="modal">
                                    <h2 className="modalTitle">Sign - Up</h2>
                                    <form className="accountForm" onSubmit={handleSubmit(onSignUpSubmit)}>
                                        <div className="labelInput">
                                            <label htmlFor="name">Full Name:</label>
                                            <input className="input" name="name" ref={register({ required: true })} placeholder="Full Name" />
                                            <div className="error">{errors.name && 'Full name is required.'}</div>
                                        </div>
                                        <div className="labelInput">
                                            <label htmlFor="email">E-mail:</label>
                                            <input className="input" name="email" type="email" ref={register({ required: true })} placeholder="E-mail" />
                                            <div className="error">{errors.email && 'E-mail is required.'}</div>
                                        </div>
                                        <div className="labelInput">
                                            <label htmlFor="password">Password:</label>
                                            <input className="input" name="password" type="password" ref={register({ required: true })} placeholder="Password" />
                                            <div className="error">{errors.password && 'Please enter your password.'}</div>
                                        </div>
                                        {signupError && <div style={{ textAlign: 'center', color: 'red' }}>{signupError}</div>}
                                        <input className="input" type="submit" value="Sign - Up" />
                                    </form>
                                    <div className="signup">
                                        <p className="question"> have an account already?</p>
                                        <h3 className="signupLink" onClick={() => wantLog()}>Log - In!</h3>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </ul>
                </>
                :
                <>
                    <div className="iconsLine">
                        {/* <ul className="nav-links"> */}
                        {/* <div className="nav-titles"> */}
                        <Link to={'/'}>
                            <img className="navImg" src={youtubeIcon} alt="YouTube Icon" />
                        </Link>
                        <h3 className="navH3">My Streamer</h3>
                        {/* </div> */}

                        <Link style={navStyle} to='/'>
                            <img className="navImg" src={homeIcon} alt="Home" />
                        </Link>
                        <Link style={navStyle} to='/about'>
                            <img className="navImg" src={aboutIcon} alt="About" />
                        </Link>

                        <div className='login'>
                            {user ? (
                                <div>
                                    <Link to={`/user/${user.id}`}>
                                        <div className='username navImg'
                                            onMouseEnter={() => setLogOutShown(true)}
                                        >
                                            {user.name ?
                                                user.name.split(' ').map(name => name[0])
                                                : null}
                                        </div>
                                    </Link>
                                    {logOutShown && (
                                        <div className="logout" onClick={logout}>(Log - Out)</div>
                                    )}
                                </div>
                            ) : null}

                            {!user && (
                                <div onClick={() => setWantLogin(!wantLogin)}><img className="navImg" src={loginIcon} alt="Login" /></div>
                            )}

                            <Modal
                                isOpen={wantLogin}
                                onRequestClose={() => setWantLogin(!wantLogin)}
                                style={customStyles}
                            >
                                <div className="modal">
                                    <h2 className="modalTitle">Log - In</h2>
                                    <form className="accountForm" onSubmit={handleSubmit(onLoginSubmit)}>
                                        <div className="labelInput">
                                            <label htmlFor="email">E-mail:</label>
                                            <input className="input" name="email" type="email" ref={register({ required: true })} placeholder="E-mail" />
                                            <div className="error">{errors.email && 'E-mail is required.'}</div>
                                        </div>
                                        <div className="labelInput">
                                            <label htmlFor="password">Password:</label>
                                            <input className="input" name="password" type="password" ref={register({ required: true })} placeholder="Password" />
                                            <div className="error">{errors.password && 'Please enter your password.'}</div>
                                        </div>
                                        {loginError && <div style={{ textAlign: 'center', color: 'red' }}>{loginError}</div>}
                                        <input className="input" type="submit" value="Login" />
                                    </form>
                                    <div className="signup">
                                        <p className="question">Does not have an account?</p>
                                        <h3 className="signupLink" onClick={() => wantSignUp()}>Sign - Up!</h3>
                                    </div>
                                </div>
                            </Modal>


                            <Modal
                                isOpen={wantSign}
                                onRequestClose={() => setWantSign(!wantSign)}
                                style={customStyles}
                            >
                                <div className="modal">
                                    <h2 className="modalTitle">Sign - Up</h2>
                                    <form className="accountForm" onSubmit={handleSubmit(onSignUpSubmit)}>
                                        <div className="labelInput">
                                            <label htmlFor="name">Full Name:</label>
                                            <input className="input" name="name" ref={register({ required: true })} placeholder="Full Name" />
                                            <div className="error">{errors.name && 'Full name is required.'}</div>
                                        </div>
                                        <div className="labelInput">
                                            <label htmlFor="email">E-mail:</label>
                                            <input className="input" name="email" type="email" ref={register({ required: true })} placeholder="E-mail" />
                                            <div className="error">{errors.email && 'E-mail is required.'}</div>
                                        </div>
                                        <div className="labelInput">
                                            <label htmlFor="password">Password:</label>
                                            <input className="input" name="password" type="password" ref={register({ required: true })} placeholder="Password" />
                                            <div className="error">{errors.password && 'Please enter your password.'}</div>
                                        </div>
                                        {signupError && <div style={{ textAlign: 'center', color: 'red' }}>{signupError}</div>}
                                        <input className="input" type="submit" value="Sign - Up" />
                                    </form>
                                    <div className="signup">
                                        <p className="question"> have an account already?</p>
                                        <h3 className="signupLink" onClick={() => wantLog()}>Log - In!</h3>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                        {/* </ul> */}
                    </div>
                    <div className="searchLine">
                        <Searchbar />
                    </div>
                </>
            }
        </nav>
    )
}

export default Navbar