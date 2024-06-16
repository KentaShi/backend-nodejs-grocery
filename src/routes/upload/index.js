"use strict"
const router = require("express").Router()
const { uploadDisk } = require("../../config/multer.config")
const UploadController = require("../../controllers/upload.controller")
const asyncHandler = require("../../helpers/asyncHandler")

const uploadController = new UploadController()

router.post(
    "/thumb",
    uploadDisk.single("file"),
    asyncHandler(uploadController.uploadFileThumb)
)

module.exports = router
