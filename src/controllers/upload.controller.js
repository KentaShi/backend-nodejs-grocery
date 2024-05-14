"use strict"

const {
    BadRequestResponse,
    ErrorResponse,
} = require("../response/error.response")
const { SuccessResponse } = require("../response/success.response")
const UploadService = require("../services/upload.service")

class UploadController {
    uploadFileThumb = async (req, res, next) => {
        try {
            const { file } = req
            if (!file) {
                return new BadRequestResponse({ message: "File missing" })
            }
            console.log(file)

            const { code, ...results } =
                await UploadService.uploadImageFromsLocal({ path: file.path })
            if (code === 200) {
                return new SuccessResponse({
                    message: "Uploaded file successfully",
                    metadata: results,
                }).send(res)
            }

            return new ErrorResponse({ message: results?.message }).send(res)
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new UploadController()
