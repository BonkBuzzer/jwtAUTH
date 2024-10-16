const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

const options = {
    httpOnly: true,
    secure: true
}
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        return console.error("Something went wrong while generating referesh and access token");
    }
}

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
    const passOk = await bcrypt.compare(password, userDoc.password);

    if (!passOk || !userDoc) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }

    try {
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(userDoc._id)
        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .status(200)
            .json({ accessToken, refreshToken, userDoc })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'something broke' });
    }
};


const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "No refresh token! Please login." });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({ message: "Refresh token is expired or used" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                accessToken, refreshToken,
                message: "Access token refreshed"
            })
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid refresh token" });
    }
}

module.exports = { register, login, refreshAccessToken }