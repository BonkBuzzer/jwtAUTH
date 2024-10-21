import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutUser, updateUser } from '../store/features/userSlice';
import { domain } from '../lib/constants';

const useAnotherHook = (url, method, dataToBeSent = {}) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user.userData);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const axiosConfig = {
                    baseURL: url,
                    timeout: 10000,
                    method,
                    headers: { Authorization: `Bearer ${userData?.accessToken}` },
                };

                if (!userData?.accessToken) {
                    dispatch(logoutUser());
                    navigate('/');
                    return;
                }

                const instance = axios.create(axiosConfig);

                // Interceptor for handling token refresh
                instance.interceptors.response.use(
                    response => response,
                    async error => {
                        const originalRequest = error.config;
                        if (error.response?.data?.expired && !originalRequest._retry) {
                            originalRequest._retry = true;
                            try {
                                const refreshResponse = await axios.post(`${domain}/auth/refresh`, {
                                    refreshToken: userData.refreshToken,
                                });
                                const { accessToken, refreshToken } = refreshResponse.data;
                                dispatch(updateUser({ accessToken, refreshToken }));
                                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                                return instance(originalRequest);
                            } catch (refreshError) {
                                dispatch(logoutUser());
                                navigate('/');
                                return Promise.reject(refreshError);
                            }
                        }
                        return Promise.reject(error);
                    }
                );

                const requestConfig = method.toLowerCase() === 'get' ? { params: dataToBeSent } : { data: dataToBeSent };
                const result = await instance.request(requestConfig);
                setResponse(result.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, method, JSON.stringify(dataToBeSent), userData, navigate, dispatch]);

    return { response, error, loading };
};

export { useAnotherHook };
