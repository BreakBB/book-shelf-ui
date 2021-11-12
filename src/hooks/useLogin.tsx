import React, {createContext, useContext, useState} from 'react';
import {AxiosResponse} from 'axios';
import apiClient from '../apiClient';

interface UseLogin {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

interface TokenResponse {
    access_token: string;
    refresh_token: string;
}

const LoginContext = createContext({isAuthenticated: false} as UseLogin);

export const LoginProvider = ({children}: {children: JSX.Element}): JSX.Element => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const tokenResponse: AxiosResponse<TokenResponse> = await apiClient.post('/login', {
                username,
                password,
            });

            localStorage.setItem('access_token', tokenResponse.data.access_token);
            localStorage.setItem('refresh_token', tokenResponse.data.refresh_token);

            setIsAuthenticated(true);
            return true;
        } catch (e) {
            console.log('Login failed:', e);
            setIsAuthenticated(false);
            return false;
        }
    };

    const logout = (): void => {
        // TODO: Logout
    };

    return <LoginContext.Provider value={{isAuthenticated, login, logout}}>{children}</LoginContext.Provider>;
};

const useLogin = (): UseLogin => {
    return useContext(LoginContext);
};

export default useLogin;
