require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes)
app.use('/', auth, userRoutes)

app.get('/', (_, res) => {
    res.json({ message: 'This is an unprotected route , it is there for testing purposes only.' });
});

app.get('/decodeNow', auth, (_, res) => {
    res.json({ message: 'Token is decoded' })
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
