import React from 'react';
import './App.css';
import BookCardView from './BookCardView/BookCardView';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Container} from '@material-ui/core';
import {Router} from 'react-router';
import {Redirect, Route, Switch} from 'react-router-dom';
import BookDetailView from './BookDetailView/BookDetailView';
import {history} from './history';
import {ToastContainer} from 'react-toastify';
import LoginView from './LoginView/LoginView';

const App = (): JSX.Element => (
    <>
        <AppBar position="static" style={{marginBottom: '20px'}}>
            <Toolbar className="toolbar">
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <h4 style={{flexGrow: 1}}>Books</h4>
                <button className="menu-login-button" onClick={() => history.push('/login')}>
                    Login
                </button>
            </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
            <Router history={history}>
                <Switch>
                    <Route exact path="/books">
                        <BookCardView />
                    </Route>
                    <Route path="/books/:isbn">
                        <BookDetailView />
                    </Route>
                    <Route exact path="/login">
                        <LoginView />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/login" />
                    </Route>
                </Switch>
            </Router>
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

export default App;
