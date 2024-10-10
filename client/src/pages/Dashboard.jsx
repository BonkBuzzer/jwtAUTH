import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '../store/hooks';

const Dashboard = () => {
    const userData = useAppSelector(state => state.user.userData);
    const [data, setData] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching data...');
            const token = userData.token;
            if (!token) {
                console.log('please login first')
                navigate('/')
                return;
            }

            try {
                const res = await axios.get('http://localhost:3000/decodeNow', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(res.data.message);
                setIsDataLoaded(true);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {isDataLoaded ? (
                <div>{data}</div>
            ) : (
                <div>
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={true}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
