const express = require('express')
const router = express.Router()
const { getProfile, verify, uploadMultipleMedia } = require('../controllers/user.controllers')
const dataStorage = require('../middleware/multer')
const { createFolder, getResults, createFile } = require('../controllers/drive.controllers')

router.get('/profile', getProfile)
router.get('/verify', verify)
router.post('/multipleUploads', dataStorage.upload.array('mediaFiles'), uploadMultipleMedia)

/* -------------------------------------- fs module -------------------------------------------- */
router.post('/createFolder', createFolder)
router.get('/getResults', getResults)
router.post('/createFile', dataStorage.upload.single('individualFile'), createFile)

module.exports = router 