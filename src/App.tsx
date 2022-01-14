import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Container} from '@material-ui/core';
import {ToastContainer} from 'react-toastify';
import AppRouter from './routes/routes';
import useLogin from './hooks/useLogin';

const App = (): JSX.Element => {
    const {isAuthenticated, logout} = useLogin();

    return (
        <>
            <AppBar position="static" style={{marginBottom: '20px'}}>
                <Toolbar className="toolbar">
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <h4 style={{flexGrow: 1}}>Books</h4>
                    {isAuthenticated && (
                        <button className="menu-login-button" onClick={logout}>
                            Logout
                        </button>
                    )}
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg">
                <AppRouter />
                <ToastContainer
                    position="bottom-center"
                    autoClose={2500}
                    rtl={false}
                    hideProgressBar
                    pauseOnFocusLoss
                    closeOnClick
                />
            </Container>
        </>
    );
};

export default App;
