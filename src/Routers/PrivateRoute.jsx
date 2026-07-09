import React, { use } from 'react';
import { AuthContext } from '../Providers/AuthContext';
import { Navigate, useLocation } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner /> ;
    }

    if (user) {
        return children
    }

    return <Navigate to='/login' state={location?.pathname} />;
};

export default PrivateRoute;