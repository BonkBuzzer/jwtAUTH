import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchData } from '../hooks/useFetchData';
import { domain } from '../lib/constants';
import Loader from './Loader';

const AuthWrapper = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const { response, error, loading } = useFetchData(`${domain}/verify`, 'GET');

    useEffect(() => {
        if (response) {
            setIsAuthenticated(true);
        } else if (error) {
            console.error('Authentication failed:', error);
            navigate('/');
        }
    }, [response, error, navigate]);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default AuthWrapper;