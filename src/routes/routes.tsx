import React from 'react';

import LoginView from '../views/LoginView/LoginView';
import BookCardView from '../views/BookCardView/BookCardView';
import BookDetailView from '../views/BookDetailView/BookDetailView';

import PrivateRoute from './PrivateRoute';
import {history} from '../history';
import {Redirect, Switch} from 'react-router-dom';
import {Router} from 'react-router';
import PublicRoute from './PublicRoute';

const AppRouter = (): JSX.Element => {
    return (
        <Router history={history}>
            <Switch>
                <PrivateRoute exact path="/books" component={BookCardView} />
                <PrivateRoute path="/books/:isbn" component={BookDetailView} />
                <PublicRoute exact path="/login" component={LoginView} />
                <Redirect to="/login" />
            </Switch>
        </Router>
    );
};

export default AppRouter;
