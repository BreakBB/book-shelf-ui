import React from 'react';

import LoginView from '../views/LoginView/LoginView';
import BookCardView from '../views/BookCardView/BookCardView';
import BookDetailView from '../views/BookDetailView/BookDetailView';

import {PrivateRoute} from './PrivateRoute';
import {history} from '../history';
import {Redirect, Route} from 'react-router-dom';
import {Router} from 'react-router';

const AppRouter = (): JSX.Element => {
    return (
        <Router history={history}>
            <Redirect from="/" to="/login" />
            <PrivateRoute exact path="/books" component={BookCardView} />
            <PrivateRoute path="/books/:isbn" component={BookDetailView} />
            <Route exact path="/login" component={LoginView} />
        </Router>
    );
};

export default AppRouter;
