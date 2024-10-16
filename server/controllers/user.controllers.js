const { User } = require('../models/User');
const fs = require("fs");

const getProfile = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email }, { password: 0 });
        if (!user) return res.status(404).json({ message: 'no user found' })
        return res.status(200).json({ user })
    } catch (error) {
        console.log(error, 'no profile found i guess');
        return res.json({ message: error.message })
    }
}

const verify = async (_, res) => {
    res
        .status(200)
        .json({ message: 'valid.' })
}

const uploadMultipleMedia = async (req, res) => {
    try {
        let initalObjDataFromReq = req.files
        let xz = []
        initalObjDataFromReq.map((file) => {
            xz.push({
                name: file.originalname,
                newName: file.filename
            })
        })
        let fxi = await User.findByIdAndUpdate(req.user._id, { $push: { userUploads: { $each: xz } } }, { new: true })
        res.json({ message: 'Multiple files uploaded successfully', userMedia: fxi })
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
}

module.exports = { getProfile, verify, uploadMultipleMedia }