import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import useLogin, {LoginProvider} from './useLogin';
import {getAccessToken, setAccessToken, setRefreshToken} from '../utils/storageUtils';
import apiClient from '../apiClient';

jest.mock('../apiClient');
jest.mock('../utils/storageUtils');

describe('useLogin', () => {
    const getAccessTokenMock = getAccessToken as jest.Mock;
    const setAccessTokenMock = setAccessToken as jest.Mock;
    const setRefreshTokenMock = setRefreshToken as jest.Mock;
    const apiClientGetMock = apiClient.get as jest.Mock;
    const apiClientPostMock = apiClient.post as jest.Mock;

    const wrapper = ({children}) => <LoginProvider>{children}</LoginProvider>;

    it('should successfully authenticate with valid access token', async () => {
        getAccessTokenMock.mockReturnValue('token');
        apiClientGetMock.mockReturnValue(true);

        const {result, waitFor} = renderHook(() => useLogin(), {wrapper});

        await act(async () => {
            await waitFor(() => expect(apiClientGetMock).toHaveBeenCalled());
        });
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('should not be authenticated without access token', async () => {
        const {result, waitFor} = renderHook(() => useLogin(), {wrapper});

        await act(async () => {
            await waitFor(() => expect(getAccessTokenMock).toHaveBeenCalled());
        });
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('should not be authenticated with invalid access token', async () => {
        getAccessTokenMock.mockReturnValue('token');
        apiClientGetMock.mockImplementation(() => {
            throw new Error();
        });

        const {result, waitFor} = renderHook(() => useLogin(), {wrapper});

        await act(async () => {
            await waitFor(() => expect(apiClientGetMock).toHaveBeenCalled());
        });

        expect(result.current.isAuthenticated).toBe(false);
    });

    describe('login', () => {
        it('should authenticate on successful login', async () => {
            apiClientPostMock.mockReturnValue({data: {}});

            const {result} = renderHook(() => useLogin(), {wrapper});
            await act(async () => {
                await result.current.login('testUser', 'testPassword');
            });

            expect(apiClientPostMock).toHaveBeenLastCalledWith('/login', {
                username: 'testUser',
                password: 'testPassword',
            });
            expect(result.current.isAuthenticated).toBe(true);
        });

        it('should update access and refresh token on successful login', async () => {
            apiClientPostMock.mockReturnValue({data: {access_token: 'at', refresh_token: 'rt'}});

            const {result} = renderHook(() => useLogin(), {wrapper});
            await act(async () => {
                await result.current.login('testUser', 'testPassword');
            });

            expect(setAccessTokenMock).toHaveBeenLastCalledWith('at');
            expect(setRefreshTokenMock).toHaveBeenLastCalledWith('rt');
        });

        it('should not be authenticated on failed login', async () => {
            apiClientPostMock.mockImplementation(() => {
                throw new Error();
            });

            const {result} = renderHook(() => useLogin(), {wrapper});
            await act(async () => {
                await result.current.login('testUser', 'testPassword');
            });

            expect(setAccessTokenMock).not.toHaveBeenCalled();
            expect(setRefreshTokenMock).not.toHaveBeenCalled();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });
});
