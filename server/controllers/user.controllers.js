const { User } = require('../models/user');

const getProfile = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email)
        const user = await User.findOne({ email }, { password: 0 });
        if (!user) return res.status(404).json({ message: 'no user found' })
        return res.status(200).json({ user })
    } catch (error) {
        console.log(error);
        return res.json({ message: error.message })
    }
}

module.exports = { getProfile }