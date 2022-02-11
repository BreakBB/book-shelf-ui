import apiClient from './apiClient';
import {getAccessToken, setAccessToken, setRefreshToken} from '../utils/storageUtils';

jest.mock('../utils/storageUtils');

jest.mock('axios', () => {
    const client = jest.fn((config) => config) as unknown as {
        interceptors: Record<string, unknown>;
        post: () => Record<string, unknown>;
    };
    client.interceptors = {
        request: {
            use: jest.fn(),
        },
        response: {
            use: jest.fn(),
        },
    };
    client.post = jest.fn();

    return {
        create: () => client,
    };
});

describe('apiClient', () => {
    const getAccessTokenMock = getAccessToken as jest.Mock;
    const setAccessTokenMock = setAccessToken as jest.Mock;
    const setRefreshTokenMock = setRefreshToken as jest.Mock;
    const clientPostMock = apiClient.post as jest.Mock;

    const requestOnFulfilledMock = (apiClient.interceptors.request.use as jest.Mock).mock.calls[0][0];
    const requestOnRejectedMock = (apiClient.interceptors.request.use as jest.Mock).mock.calls[0][1];
    const responseOnFulfilledMock = (apiClient.interceptors.response.use as jest.Mock).mock.calls[0][0];
    const responseOnRejectedMock = (apiClient.interceptors.response.use as jest.Mock).mock.calls[0][1];

    describe('request interceptor', () => {
        it('should add Bearer token', () => {
            getAccessTokenMock.mockReturnValue('123');

            const result = requestOnFulfilledMock({headers: {}});

            expect(result).toEqual({
                headers: {
                    Authorization: 'Bearer 123',
                },
            });
        });

        it('should not add Bearer token when no access token is available', () => {
            const config = {};

            const result = requestOnFulfilledMock(config);

            expect(result).toBe(config);
        });

        it('should not add Bearer token for /login call', () => {
            getAccessTokenMock.mockReturnValue('123');
            const config = {url: '/login'};

            const result = requestOnFulfilledMock(config);

            expect(result).toBe(config);
        });

        it('should forward error', () => {
            const error = {};

            const result = requestOnRejectedMock(error);

            expect(result).toBe(error);
        });
    });

    describe('response interceptor', () => {
        it('should forward successful responses', () => {
            const response = {};

            const result = responseOnFulfilledMock(response);

            expect(result).toBe(response);
        });

        it('should not retry on /login', async () => {
            const error = {
                config: {
                    url: '/login',
                },
                isRetry: false,
            };

            const rejectedPromise = responseOnRejectedMock(error);

            await expect(rejectedPromise).rejects.toEqual({
                config: {url: '/login'},
                isRetry: false,
            });

            expect(clientPostMock).not.toHaveBeenCalled();
            expect(setAccessTokenMock).not.toHaveBeenCalled();
            expect(setRefreshTokenMock).not.toHaveBeenCalled();
        });

        it('should not retry on /login/refresh', async () => {
            const error = {
                config: {
                    url: '/login/refresh',
                },
                isRetry: false,
            };

            const rejectedPromise = responseOnRejectedMock(error);

            await expect(rejectedPromise).rejects.toEqual({
                config: {url: '/login/refresh'},
                isRetry: false,
            });

            expect(clientPostMock).not.toHaveBeenCalled();
            expect(setAccessTokenMock).not.toHaveBeenCalled();
            expect(setRefreshTokenMock).not.toHaveBeenCalled();
        });

        it('should only retry on status code 401', async () => {
            const error = {
                config: {
                    url: '/books',
                },
                response: {
                    status: 500,
                },
                isRetry: false,
            };

            const rejectedPromise = responseOnRejectedMock(error);

            await expect(rejectedPromise).rejects.toEqual({
                config: {url: '/books'},
                response: {
                    status: 500,
                },
                isRetry: false,
            });

            expect(clientPostMock).not.toHaveBeenCalled();
            expect(setAccessTokenMock).not.toHaveBeenCalled();
            expect(setRefreshTokenMock).not.toHaveBeenCalled();
        });

        it('should save new tokens', async () => {
            clientPostMock.mockReturnValue({
                data: {
                    access_token: 'at',
                    refresh_token: 'rt',
                },
            });
            const error = {
                config: {},
                response: {
                    status: 401,
                },
                isRetry: false,
            };

            await responseOnRejectedMock(error);

            expect(clientPostMock).toHaveBeenCalled();
            expect(setAccessTokenMock).toHaveBeenLastCalledWith('at');
            expect(setRefreshTokenMock).toHaveBeenLastCalledWith('rt');
            expect(apiClient).toHaveBeenCalledWith({isRetry: true});
        });

        it('should handle network errors', async () => {
            const networkError = new Error();
            clientPostMock.mockImplementation(() => {
                throw networkError;
            });
            const error = {
                config: {},
                response: {
                    status: 401,
                },
            };

            const resultPromise = responseOnRejectedMock(error);

            await expect(resultPromise).rejects.toBe(networkError);
            expect(clientPostMock).toHaveBeenCalled();
            expect(setAccessTokenMock).not.toHaveBeenCalled();
            expect(setRefreshTokenMock).not.toHaveBeenCalled();
        });

        it('should retry only once', async () => {
            const error = {
                config: {
                    isRetry: true,
                },
                response: {
                    status: 401,
                },
            };

            const resultPromise = responseOnRejectedMock(error);

            await expect(resultPromise).rejects.toBe(error);
            expect(clientPostMock).not.toHaveBeenCalled();
            expect(setAccessTokenMock).not.toHaveBeenCalled();
            expect(setRefreshTokenMock).not.toHaveBeenCalled();
        });
    });
});
