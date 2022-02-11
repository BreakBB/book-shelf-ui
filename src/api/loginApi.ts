import {getRefreshToken} from '../utils/storageUtils';
import apiClient from './apiClient';
import {AxiosResponse} from 'axios';

interface TokenResponse {
    access_token: string;
    refresh_token: string;
}

export const makeRequestTokenRequest = async (): Promise<AxiosResponse<TokenResponse>> =>
    await apiClient.post('/login/refresh', {
        refreshToken: getRefreshToken(),
    });

export const makeCheckTokenRequest = (): Promise<AxiosResponse<boolean>> => apiClient.get('/login/checkToken');

export const makeLoginRequest = (username: string, password: string): Promise<AxiosResponse<TokenResponse>> =>
    apiClient.post('/login', {
        username,
        password,
    });
