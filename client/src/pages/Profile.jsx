import React from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { domain } from '../lib/constants'
import { useAppSelector } from '../store/hooks';
import Loader from '../Components/Loader';

const Profile = () => {
    const userData = useAppSelector(state => state.user.userData);
    const { response, error, loading } = useFetchData(
        `${domain}/profile`,
        'GET',
        { email: userData?.email }
    );

    if (loading) return <Loader />

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div>ID: {response.user._id}</div>
            <div>Email: {response.user.email}</div>
        </div>
    );
};

export default Profile;