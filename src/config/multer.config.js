"use strict"

const multer = require("multer")
const cloudinary = require("./cloudinary.config")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png"],
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const uploadCloud = multer({
    storage: storage,
})

module.exports = { uploadCloud }
