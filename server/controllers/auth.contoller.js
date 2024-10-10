const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    if (!passwordPattern.test(password)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long and smaller than 20, include at least one uppercase letter, one lowercase letter, one digit, and one special character.'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const newUser = new User({
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: { email: newUser.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const passOk = await bcrypt.compare(password, userDoc.password);
    if (!passOk) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }
    try {
        const token = jwt.sign({ email, id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token).json({ message: 'Login Success ! \n You will be redirected within 3 seconds !', token, userDoc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'something broke' });
    }
};

module.exports = { register, login }