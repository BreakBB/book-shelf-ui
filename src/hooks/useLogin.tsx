import React, {createContext, useContext, useEffect, useState} from 'react';
import {clearTokens, getAccessToken, setAccessToken, setRefreshToken} from '../utils/storageUtils';
import {history} from '../history';
import {makeCheckTokenRequest, makeLoginRequest} from '../api/loginApi';

interface UseLogin {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const LoginContext = createContext({isAuthenticated: false} as UseLogin);

export const LoginProvider = ({children}: {children: JSX.Element}): JSX.Element => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && getAccessToken()) {
            const checkExistingAccessToken = async () => {
                try {
                    const response = await makeCheckTokenRequest();
                    setIsAuthenticated(response.data);
                } catch (e) {
                    // Response is different to 2XX
                    setIsAuthenticated(false);
                }
            };
            void checkExistingAccessToken();
        }
    });

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const tokenResponse = await makeLoginRequest(username, password);

            setAccessToken(tokenResponse.data.access_token);
            setRefreshToken(tokenResponse.data.refresh_token);

            setIsAuthenticated(true);
            return true;
        } catch (e) {
            console.log('Login failed:', e);
            setIsAuthenticated(false);
            return false;
        }
    };

    const logout = (): void => {
        clearTokens();
        setIsAuthenticated(false);
        history.push('/login');
    };

    return <LoginContext.Provider value={{isAuthenticated, login, logout}}>{children}</LoginContext.Provider>;
};

const useLogin = (): UseLogin => {
    return useContext(LoginContext);
};

export default useLogin;
