"use strict"
const router = require("express").Router()
const { uploadCloud } = require("../../config/multer.config")
const uploadController = require("../../controllers/upload.controller")
const asyncHandler = require("../../helpers/asyncHandler")

router.post(
    "/thumb",
    uploadCloud.single("file"),
    asyncHandler(uploadController.uploadFileThumb)
)

module.exports = router
