"use strict"
const router = require("express").Router()
const { uploadDisk } = require("../../config/multer.config")
const uploadController = require("../../controllers/upload.controller")
const asyncHandler = require("../../helpers/asyncHandler")

router.post(
    "/thumb",
    uploadDisk.single("file"),
    asyncHandler(uploadController.uploadFileThumb)
)

module.exports = router
