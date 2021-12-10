import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8090',
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken && config.url !== '/login') {
            config.headers['Authorization'] = 'Bearer ' + accessToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;

        if (originalConfig.url !== '/login' && originalConfig.url !== '/login/checkToken' && error.response) {
            if (error.response.status === 401 && !originalConfig.isRetry) {
                originalConfig.isRetry = true;
                try {
                    const response = await client.post('/login', {
                        refreshToken: localStorage.getItem('refresh_token'),
                    });
                    localStorage.setItem('access_token', response.data.access_token);
                    localStorage.setItem('refresh_token', response.data.refresh_token);
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
