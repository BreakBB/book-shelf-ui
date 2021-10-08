import React, {useState} from 'react';
import {history} from '../history';
import {Redirect, useLocation} from 'react-router-dom';
import './LoginView.css';
import useLogin from '../hooks/useLogin';

const LoginView = (): JSX.Element => {
    const location = useLocation<{[key: string]: unknown}>();
    const currentLocationState = location.state || {
        from: {pathname: '/books'},
    };
    const {isAuthenticated, login} = useLogin();

    const [loginFailed, setLoginFailed] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const {username, password} = e.target.elements;

        if (!username.value || !password.value) {
            // Required fields are missing
            setLoginFailed(true);
            return;
        }

        const loginSuccessful = login(username.value, password.value);
        if (!loginSuccessful) {
            setLoginFailed(true);
            return;
        }

        history.push('/books');
    };

    if (isAuthenticated) {
        return <Redirect to={currentLocationState?.from as string} />;
    }

    return (
        <>
            <h1 className="title">Login</h1>
            <form className="login-form" onSubmit={onSubmit}>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" />

                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" />
                {loginFailed && <span className="login-error-message">Login failed</span>}
                <button className="login-button" type="submit">
                    Login
                </button>
            </form>
        </>
    );
};

export default LoginView;
