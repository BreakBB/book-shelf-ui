import React, {useState} from 'react';
import {history} from '../history';
import {Redirect} from 'react-router-dom';
import {isLoggedIn} from './loginUtils';
import './LoginView.css';

const LoginView = (): JSX.Element => {
    const [loginFailed, setLoginFailed] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const {username, password} = e.target.elements;

        if (!username.value || !password.value) {
            setLoginFailed(true);
            // Required fields are missing
            return;
        }

        history.push('/books');
    };

    if (isLoggedIn()) {
        return <Redirect to="/books" />;
    }

    return (
        <>
            <h1 className="title">Login</h1>
            <form className="login-form" onSubmit={onSubmit}>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="email" />

                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" />
                {loginFailed && (
                    <>
                        <span className="login-error-message">Login failed</span>
                    </>
                )}
                <button className="login-button" type="submit">
                    Login
                </button>
            </form>
        </>
    );
};

export default LoginView;
