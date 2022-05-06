import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import useLogin, {LoginProvider} from './useLogin';
import {clearTokens, getAccessToken, setAccessToken, setRefreshToken} from '../utils/storageUtils';
import {history} from '../history';
import {makeCheckTokenRequest, makeLoginRequest} from '../api/loginApi';

jest.mock('../api/loginApi');
jest.mock('../utils/storageUtils');

describe('useLogin', () => {
    const getAccessTokenMock = getAccessToken as jest.Mock;
    const setAccessTokenMock = setAccessToken as jest.Mock;
    const setRefreshTokenMock = setRefreshToken as jest.Mock;
    const clearTokensMock = clearTokens as jest.Mock;
    const checkTokenMock = makeCheckTokenRequest as jest.Mock;
    const makeLoginMock = makeLoginRequest as jest.Mock;

    const wrapper = ({children}) => <LoginProvider>{children}</LoginProvider>;

    it('should successfully authenticate with valid access token', async () => {
        getAccessTokenMock.mockReturnValue('token');
        checkTokenMock.mockReturnValue({data: true});

        const {result, waitFor} = renderHook(() => useLogin(), {wrapper});

        await act(async () => {
            await waitFor(() => expect(checkTokenMock).toHaveBeenCalled());
        });
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
    });

    it('should not be authenticated without access token', async () => {
        const {result, waitFor} = renderHook(() => useLogin(), {wrapper});

        await act(async () => {
            await waitFor(() => expect(getAccessTokenMock).toHaveBeenCalled());
        });
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });

    it('should not be authenticated with invalid access token', async () => {
        getAccessTokenMock.mockReturnValue('token');
        checkTokenMock.mockImplementation(() => {
            throw new Error();
        });

        const {result, waitFor} = renderHook(() => useLogin(), {wrapper});

        await act(async () => {
            await waitFor(() => expect(checkTokenMock).toHaveBeenCalled());
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });

    describe('login', () => {
        it('should authenticate on successful login', async () => {
            makeLoginMock.mockReturnValue({data: {}});

            const {result} = renderHook(() => useLogin(), {wrapper});
            await act(async () => {
                await result.current.login('testUser', 'testPassword');
            });

            expect(makeLoginMock).toHaveBeenLastCalledWith('testUser', 'testPassword');
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.isLoading).toBe(false);
        });

        it('should update access and refresh token on successful login', async () => {
            makeLoginMock.mockReturnValue({data: {access_token: 'at', refresh_token: 'rt'}});

            const {result} = renderHook(() => useLogin(), {wrapper});
            await act(async () => {
                await result.current.login('testUser', 'testPassword');
            });

            expect(setAccessTokenMock).toHaveBeenLastCalledWith('at');
            expect(setRefreshTokenMock).toHaveBeenLastCalledWith('rt');
        });

        it('should not be authenticated on failed login', async () => {
            makeLoginMock.mockImplementation(() => {
                throw new Error();
            });

            const {result} = renderHook(() => useLogin(), {wrapper});
            await act(async () => {
                await result.current.login('testUser', 'testPassword');
            });

            expect(setAccessTokenMock).not.toHaveBeenCalled();
            expect(setRefreshTokenMock).not.toHaveBeenCalled();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('logout', () => {
        it('should remove tokens and navigate to login view', async () => {
            getAccessTokenMock.mockReturnValue('token');
            checkTokenMock.mockReturnValue(true);

            const {result, waitFor} = renderHook(() => useLogin(), {wrapper});
            await act(async () => {
                result.current.logout();
                await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
            });

            expect(clearTokensMock).toHaveBeenCalled();
            expect(history.location.pathname).toBe('/login');
        });
    });
});
