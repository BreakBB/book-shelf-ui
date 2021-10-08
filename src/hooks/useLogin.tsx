import React, {createContext, ReactNode, useContext, useState} from 'react';
import axios, {AxiosResponse} from 'axios';

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

export const LoginProvider = ({children}: {children: ReactNode}): JSX.Element => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const tokenResponse: AxiosResponse<TokenResponse> = await axios.post('/api/login', {
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

    const logout = (): void => {};

    return <LoginContext.Provider value={{isAuthenticated, login, logout}}>{children}</LoginContext.Provider>;
};

const useLogin = (): UseLogin => {
    return useContext(LoginContext);
};

export default useLogin;
