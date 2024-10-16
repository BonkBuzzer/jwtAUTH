const { request } = require("express");
const multer = require("multer");
const path = require("path")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, (Math.floor(Math.random() * Date.now()).toString() + path.extname(file.originalname)));
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/*' || file.mimetype === '.xlsx' || file.mimetype === '.xls') {
            cb(null, true);
        } else {
            cb(new Error('Only Images and Excel sheets are allowed.'));
        }
    }
});

module.exports = {
    upload: multer({ storage }),
};