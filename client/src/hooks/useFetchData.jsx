import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutUser, updateUser } from '../store/features/userSlice';
import { domain } from '../lib/constants';

const useFetchData = (url, method, dataToBeSent = {}) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user.userData);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;

        const fetchData = async () => {
            try {
                const axiosConfig = {
                    baseURL: url,
                    timeout: 10000,
                    method,
                };
                const token = userData?.accessToken;
                if (!token) {
                    dispatch(logoutUser());
                    navigate('/');
                    return;
                }
                axiosConfig.headers = { Authorization: `Bearer ${token}` };

                const instance = axios.create(axiosConfig);

                instance.interceptors.response.use(
                    (response) => response,
                    async (error) => {
                        const originalRequest = error.config;
                        console.log(error)
                        if (error.response?.data?.expired && !originalRequest._retry) {
                            originalRequest._retry = true;
                            try {
                                const refreshResponse = await axios.post(`${domain}/auth/refresh`, {
                                    refreshToken: userData.refreshToken
                                });
                                console.log('token refresh time dude !!!')
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

                const requestConfig = {};
                if (method.toLowerCase() === 'get') {
                    requestConfig.params = dataToBeSent || {};
                } else {
                    requestConfig.data = dataToBeSent;
                }

                const result = await instance.request(requestConfig);
                setResponse(result.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchedRef.current = true;
    }, [url, method, userData, navigate, dispatch]);

    return { response, error, loading };
};

export { useFetchData };