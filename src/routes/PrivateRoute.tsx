import * as React from 'react';
import {Route, Redirect, RouteComponentProps} from 'react-router-dom';
import type {RouteProps} from 'react-router-dom';
import useLogin from '../hooks/useLogin';

interface PrivateRouteParams extends RouteProps {
    component: React.ComponentType<RouteComponentProps> | React.ComponentType;
}

export const PrivateRoute = ({component: Component, ...rest}: PrivateRouteParams): JSX.Element => {
    const {isAuthenticated} = useLogin();

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: {from: props.location},
                        }}
                    />
                )
            }
        />
    );
};
