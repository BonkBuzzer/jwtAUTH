const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    },
    userUploads: {
        type: [{
            path: {
                type: String,
            },
            fileName: {
                type: String || null
            },
            storageFilename: {
                type: String || null
            }
        }]
    }
}, { timestamps: true })

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = model('User', userSchema)


module.exports = { User }