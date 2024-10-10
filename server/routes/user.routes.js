const express = require('express')
const router = express.Router()
const { getProfile } = require('../controllers/user.controllers')

router.get('/profile', getProfile)

module.exports = router 