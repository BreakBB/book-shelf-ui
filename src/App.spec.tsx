import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';
import {history} from './history';
import useLogin from './hooks/useLogin';
import userEvent from '@testing-library/user-event';

jest.mock('./hooks/useLogin');

describe('App', () => {
    const useLoginMock = useLogin as jest.Mock;
    let isAuthenticatedMock = false;
    const logoutMock = jest.fn();

    beforeEach(() => {
        useLoginMock.mockImplementation(() => {
            return {
                isAuthenticated: isAuthenticatedMock,
                logout: logoutMock,
            };
        });
        history.push('/');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should start and render default elements', () => {
        render(<App />);

        expect(screen.getByText('Books')).toBeDefined();
        expect(screen.getAllByText('Login')).toBeDefined();
    });

    it('should navigate to login page if not logged in', () => {
        render(<App />);

        expect(history.location.pathname).toBe('/login');
    });

    it('should navigate to book overview if already logged in', () => {
        isAuthenticatedMock = true;

        render(<App />);

        expect(history.location.pathname).toBe('/books');
    });

    it('should successfully logout', () => {
        isAuthenticatedMock = true;

        render(<App />);

        expect(history.location.pathname).toBe('/books');

        const logoutButton = screen.getByRole('button', {name: 'Logout'});
        userEvent.click(logoutButton);

        expect(logoutMock).toHaveBeenCalled();
    });
});
