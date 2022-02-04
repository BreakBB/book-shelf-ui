import React from 'react';
import LoginView from './LoginView';
import {act, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {history} from '../../history';
import {renderWithRouter} from '../../testUtils';
import useLogin from '../../hooks/useLogin';

jest.mock('../../hooks/useLogin');

describe('LoginView', () => {
    const useLoginMock = useLogin as jest.Mock;
    let isAuthenticatedMock = false;
    const loginMock = jest.fn();

    beforeEach(() => {
        useLoginMock.mockImplementation(() => {
            return {
                isAuthenticated: isAuthenticatedMock,
                login: loginMock,
            };
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should initially render empty inputs', () => {
        renderWithRouter(<LoginView />);

        const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
        expect(usernameInput.value).toBe('');
        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        expect(passwordInput.value).toBe('');
        screen.getByRole('button', {name: /Login/i});
        expect(screen.queryByText('Login failed')).toBe(null);
    });

    describe('if not logged in', () => {
        beforeEach(() => {
            isAuthenticatedMock = false;
            history.push('/login');
        });

        it('should navigate to Book overview on successful login', async () => {
            loginMock.mockReturnValue(true);

            renderWithRouter(<LoginView />);

            const usernameInput = screen.getByLabelText('Username');
            userEvent.type(usernameInput, 'testUsername');
            const passwordInput = screen.getByLabelText('Password');
            userEvent.type(passwordInput, 'testPassword');
            const submitButton = screen.getByRole('button', {name: /Login/i});
            userEvent.click(submitButton);

            await waitFor(() => {
                expect(history.location.pathname).toBe('/books');
            });
        });

        it('should show error message on failed login', async () => {
            loginMock.mockResolvedValue(false);

            renderWithRouter(<LoginView />);

            const usernameInput = screen.getByLabelText('Username');
            userEvent.type(usernameInput, 'wrongUsername');
            const passwordInput = screen.getByLabelText('Password');
            userEvent.type(passwordInput, 'wrongPassword');
            const submitButton = screen.getByRole('button', {name: /Login/i});
            act(() => {
                userEvent.click(submitButton);
            });

            await screen.findByText('Login failed');
        });

        it('should not navigate anywhere without required information', () => {
            renderWithRouter(<LoginView />);

            const submitButton = screen.getByRole('button', {name: /Login/i});
            userEvent.click(submitButton);

            expect(history.location.pathname).toBe('/login');
        });

        it('should show error message on failed login without credentials', async () => {
            renderWithRouter(<LoginView />);

            const submitButton = screen.getByRole('button', {name: /Login/i});
            act(() => {
                userEvent.click(submitButton);
            });

            await screen.findByText('Login failed');
        });
    });

    describe('if already logged in', () => {
        beforeEach(() => {
            isAuthenticatedMock = true;
            history.push('/login');
        });

        it('should redirect to book overview if already logged in', () => {
            renderWithRouter(<LoginView />);

            expect(history.location.pathname).toBe('/books');
        });
    });
});
