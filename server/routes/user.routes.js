const express = require('express')
const router = express.Router()
const { getProfile, verify, uploadMultipleMedia } = require('../controllers/user.controllers')
const dataStorage = require('../middleware/multer')
const { createResource, getResults } = require('../controllers/drive.controllers')

router.get('/profile', getProfile)
router.get('/verify', verify)
router.post('/multipleUploads', dataStorage.upload.array('mediaFiles'), uploadMultipleMedia)

/* -------------------------------------- fs module -------------------------------------------- */
router.post('/createResource', createResource)
router.get('/getResults', getResults)

module.exports = router 