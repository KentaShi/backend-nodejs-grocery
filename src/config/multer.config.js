"use strict"

const multer = require("multer")

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./src/uploads")
        },
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}-${Date.now()}`)
        },
    }),
})

module.exports = { uploadDisk }
