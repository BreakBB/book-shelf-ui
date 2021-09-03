import React from 'react';
import './App.css';
import BookCardView from './BookCardView/BookCardView';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Container} from '@material-ui/core';
import {Router} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import BookDetailView from './BookDetailView/BookDetailView';
import Theme from './Theme';
import {history} from './history';
import {ToastContainer} from 'react-toastify';

const App = (): JSX.Element => (
    <Theme className="App">
        <AppBar position="static" style={{marginBottom: '20px'}}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <h4>Books</h4>
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
                    <Route path="/">
                        <BookCardView />
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
    </Theme>
);

export default App;
