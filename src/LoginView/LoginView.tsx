import React, {useState} from 'react';
import {history} from '../history';
import {Redirect} from 'react-router-dom';
import {isLoggedIn} from './loginUtils';

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
            <form onSubmit={onSubmit}>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="email" required />
                <br />
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required />
                <br />
                {loginFailed && <span>Login failed</span>}
                <button type="submit">Login</button>
            </form>
        </>
    );
};

export default LoginView;
