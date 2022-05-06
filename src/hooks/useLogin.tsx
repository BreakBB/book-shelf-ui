import React, {createContext, useContext, useEffect, useState} from 'react';
import {clearTokens, getAccessToken, setAccessToken, setRefreshToken} from '../utils/storageUtils';
import {history} from '../history';
import {makeCheckTokenRequest, makeLoginRequest} from '../api/loginApi';

interface UseLogin {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const LoginContext = createContext({isAuthenticated: false} as UseLogin);

export const LoginProvider = ({children}: {children: JSX.Element}): JSX.Element => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated && getAccessToken()) {
            const checkExistingAccessToken = async () => {
                setIsLoading(true);
                try {
                    const response = await makeCheckTokenRequest();
                    setIsAuthenticated(response.data);
                } catch (e) {
                    // Response is different to 2XX
                    setIsAuthenticated(false);
                }
                setIsLoading(false);
            };
            void checkExistingAccessToken();
            return;
        }
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const tokenResponse = await makeLoginRequest(username, password);

            setAccessToken(tokenResponse.data.access_token);
            setRefreshToken(tokenResponse.data.refresh_token);

            setIsAuthenticated(true);
            setIsLoading(false);
            return true;
        } catch (e) {
            console.log('Login failed:', e);
            setIsAuthenticated(false);
            setIsLoading(false);
            return false;
        }
    };

    const logout = (): void => {
        setIsLoading(true);
        clearTokens();
        setIsAuthenticated(false);
        setIsLoading(false);
        history.push('/login');
    };

    return (
        <LoginContext.Provider value={{isAuthenticated, isLoading, login, logout}}>{children}</LoginContext.Provider>
    );
};

const useLogin = (): UseLogin => {
    return useContext(LoginContext);
};

export default useLogin;
