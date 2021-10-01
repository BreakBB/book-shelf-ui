import React from 'react';
import LoginView from './LoginView';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {history} from '../history';
import {renderWithRouter} from '../testUtils';
import {isLoggedIn} from './loginUtils';

jest.mock('./loginUtils.ts', () => {
    return {
        isLoggedIn: jest.fn(),
    };
});

describe('LoginView', () => {
    const isLoggedInMock = isLoggedIn as jest.Mock;

    it('should initially render empty inputs', () => {
        render(<LoginView />);

        const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
        expect(usernameInput.value).toBe('');
        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        expect(passwordInput.value).toBe('');
        screen.getByRole('button', {name: /Login/i});
        expect(screen.queryByText('Login failed')).toBe(null);
    });

    describe('if not logged in', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            isLoggedInMock.mockReturnValue(false);
            history.push('/login');
        });

        it('should navigate to Book overview on successful login', () => {
            render(<LoginView />);

            const usernameInput = screen.getByLabelText('Username');
            userEvent.type(usernameInput, 'testUsername');
            const passwordInput = screen.getByLabelText('Password');
            userEvent.type(passwordInput, 'testPassword');
            const submitButton = screen.getByRole('button', {name: /Login/i});
            userEvent.click(submitButton);

            expect(history.location.pathname).toBe('/books');
        });

        it('should not navigate anywhere without required information', () => {
            render(<LoginView />);

            const submitButton = screen.getByRole('button', {name: /Login/i});
            userEvent.click(submitButton);

            expect(history.location.pathname).toBe('/login');
        });

        it('should show error message on failed login', () => {
            render(<LoginView />);

            const submitButton = screen.getByRole('button', {name: /Login/i});
            userEvent.click(submitButton);

            expect(screen.getByText('Login failed')).toBeDefined();
        });
    });

    describe('if already logged in', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            isLoggedInMock.mockReturnValue(true);
            history.push('/login');
        });

        it('should redirect to book overview if already logged in', () => {
            renderWithRouter(<LoginView />);

            expect(history.location.pathname).toBe('/books');
        });
    });
});
