import * as React from 'react';
import type {RouteProps} from 'react-router-dom';
import {Redirect, Route, RouteComponentProps} from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

interface PrivateRouteParams extends RouteProps {
    component: React.ComponentType<RouteComponentProps> | React.ComponentType;
}

const PrivateRoute = ({component: Component, ...rest}: PrivateRouteParams): JSX.Element => {
    const {isAuthenticated, isLoading} = useLogin();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (isLoading) {
                    return <LoadingSpinner />;
                } else if (isAuthenticated) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: {from: props.location},
                            }}
                        />
                    );
                }
            }}
        />
    );
};

export default PrivateRoute;
