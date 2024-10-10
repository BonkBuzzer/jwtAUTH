import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const userData = useAppSelector(state => state.user.userData);
    const [email, setEmail] = useState('')
    const [id, setId] = useState('')
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = userData?.token;
            if (!token) {
                console.log('please login first')
                navigate('/')
                return;
            }
            const res = await axios.get('http://localhost:3000/profile', {
                email: userData.email
            }, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            })
            console.log(res.data.user)
            setEmail(res.data.email)
            setId(res.data._id)
            setIsDataLoaded(true)
        }
        fetchData()
    }, [])
    return (
        <>
            {isDataLoaded ? (
                <div>
                    <div>{id}</div>
                    <div>{email}</div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </>
    )
}

export default Profile