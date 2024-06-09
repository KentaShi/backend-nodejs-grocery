"use strict"

const { BadRequestError, AppError } = require("../errors/app.error")
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
                throw new BadRequestError("Missing upload file")
            }

            const { code, ...results } =
                await UploadService.uploadImageFromsLocal({ path: file.path })
            if (code === 200) {
                return new SuccessResponse({
                    message: "Uploaded file successfully",
                    metadata: results,
                }).send(res)
            }

            throw new AppError()
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new UploadController()
