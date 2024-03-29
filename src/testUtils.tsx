import React from 'react';
import {render, RenderResult} from '@testing-library/react';
import {Router} from 'react-router';
import {history} from './history';
import {Route} from 'react-router-dom';
import {LoginProvider} from './hooks/useLogin';

export const TEST_BOOKS = {
    harryPotter1: {
        isbn: '3551551677',
        title: 'Harry Potter und der Stein der Weisen',
        author: 'J. K. Rowling',
        releaseDate: '01.01.1999',
        hasCover: true,
    },
    harryPotter2: {
        isbn: '3551551685',
        title: 'Harry Potter und die Kammer des Schreckens',
        author: 'J. K. Rowling',
        releaseDate: '01.11.1998',
        hasCover: true,
    },
};

export const renderWithRouter = (component: JSX.Element): RenderResult => {
    return render(<Router history={history}>{component}</Router>);
};

export const renderWithRouterMatch = (component: React.ComponentType, path: string): RenderResult => {
    return renderWithLoginProvider(
        <Router history={history}>
            <Route path={path} component={component} />
        </Router>
    );
};

const renderWithLoginProvider = (component: JSX.Element): RenderResult => {
    return render(<LoginProvider>{component}</LoginProvider>);
};
