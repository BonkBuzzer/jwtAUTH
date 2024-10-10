import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/features/userSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        setIsValidEmail(emailPattern.test(value));
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        setIsValidPassword(passwordPattern.test(value));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isValidEmail || !isValidPassword) {
            setSnackbarMessage('Invalid email or password format.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email,
                password
            }, { withCredentials: true });
            setSnackbarMessage(response?.data.message || 'Login Successful!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            console.log(response)
            const token = response?.data.token;
            const id = response?.data.userDoc._id;
            dispatch(setUser({ email, token, id }))
            await new Promise(resolve => {
                const timer = setTimeout(() => {
                    resolve();
                    clearTimeout(timer);
                }, 3000);
            });
            navigate('/dashboard')
        } catch (error) {
            setSnackbarMessage(error.response?.data?.message || 'Login failed.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="bg-black min-h-screen flex items-center justify-center">
            <div className="flex bg-[#1E1E1E] rounded-md shadow-lg justify-evenly">
                <div className="p-8 w-96">
                    <img src="/logo.webp" alt="Logo" className="w-20 h-20 mb-6 mx-auto" />
                    <h1 className="text-2xl font-bold text-white mb-2">Sign in</h1>
                    <p className="text-white mb-6">
                        Don't have an account?{' '}
                        <Link to={'/signup'} className="text-[#00A4EF] font-bold underline">
                            Sign up
                        </Link>
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-white mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleEmailChange}
                                required
                                className="w-full px-3 py-2 bg-transparent border-[#89949f] hover:border-white focus:border-[#00A4EF] border-[1px] text-white rounded-md focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-white mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-3 py-2 bg-transparent border-[#89949f] hover:border-white focus:border-[#00A4EF] border-[1px] text-white rounded-md focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!(isValidEmail && isValidPassword)}
                            className="disabled:bg-gray-500 w-full bg-[#00A4EF] text-white font-semibold py-2 rounded-md transition duration-300"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
                <img src="/login.jpg" alt="Login" className="w-[560px] h-[560px] rounded-r-md object-cover" />
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Login;
