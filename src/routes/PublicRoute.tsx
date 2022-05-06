import React from 'react';
import {Route, RouteComponentProps, RouteProps} from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

interface PublicRouteParams extends RouteProps {
    component: React.ComponentType<RouteComponentProps> | React.ComponentType;
}

const PublicRoute = ({component: Component, ...rest}: PublicRouteParams): JSX.Element => {
    const {isLoading} = useLogin();
    return <Route {...rest} render={(props) => (isLoading ? <LoadingSpinner /> : <Component {...props} />)} />;
};

export default PublicRoute;
