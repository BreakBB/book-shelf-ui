import axios from 'axios';
import {getAccessToken, getRefreshToken, setAccessToken, setRefreshToken} from './utils/storageUtils';

const client = axios.create({
    baseURL: 'http://localhost:8090',
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken && config.url !== '/login') {
            config.headers['Authorization'] = 'Bearer ' + accessToken;
        }
        return config;
    },
    (error) => error
);

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalConfig = error.config;

        if (originalConfig.url !== '/login' && originalConfig.url !== '/login/checkToken' && error.response) {
            if (error.response.status === 401 && !originalConfig.isRetry) {
                originalConfig.isRetry = true;
                try {
                    const response = await client.post('/login', {
                        refreshToken: getRefreshToken(),
                    });
                    setAccessToken(response.data.access_token);
                    setRefreshToken(response.data.refresh_token);
                    return client(originalConfig);
                } catch (retryError) {
                    return Promise.reject(retryError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default client;
