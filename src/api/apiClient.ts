import axios from 'axios';
import {getAccessToken, setAccessToken, setRefreshToken} from '../utils/storageUtils';
import {makeRequestTokenRequest} from './loginApi';

const client = axios.create({
    baseURL: 'http://localhost:8090',
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken && config.url !== '/login' && config.url !== '/login/refresh') {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => error
);

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        if (
            !config.isRetry &&
            config.url !== '/login' &&
            config.url !== '/login/refresh' &&
            error.response &&
            error.response.status === 401
        ) {
            config.isRetry = true;
            const response = await makeRequestTokenRequest();
            setAccessToken(response.data.access_token);
            setRefreshToken(response.data.refresh_token);
            return client(config);
        }

        return Promise.reject(error);
    }
);

export default client;
