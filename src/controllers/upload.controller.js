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
                return next(new BadRequestError("Missing upload file"))
            }

            const { code, error, ...results } =
                await UploadService.uploadImageFromsLocal({ path: file.path })
            if (error) return next(error)

            return new SuccessResponse({
                message: "success",
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new UploadController()
