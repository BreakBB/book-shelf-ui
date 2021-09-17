import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';
import {history} from './history';
import {isLoggedIn} from './LoginView/loginUtils';

jest.mock('./loginView/loginUtils.ts', () => {
    return {
        isLoggedIn: jest.fn(),
    };
});

describe('App', () => {
    const isLoggedInMock = isLoggedIn as jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks();
        history.push('/');
    });

    it('should start and render default elements', () => {
        render(<App />);

        expect(screen.getByText('Books')).toBeDefined();
        expect(screen.getAllByText('Login')).toBeDefined();
    });

    it('should navigate to login page if not logged in', () => {
        isLoggedInMock.mockReturnValue(false);

        render(<App />);

        expect(history.location.pathname).toBe('/login');
    });

    it('should navigate to book overview if already logged in', () => {
        isLoggedInMock.mockReturnValue(true);

        render(<App />);

        expect(history.location.pathname).toBe('/books');
    });
});
