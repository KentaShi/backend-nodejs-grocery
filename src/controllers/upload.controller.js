"use strict"

const { BadRequestError, AppError } = require("../core/errors/app.error")
const { SuccessResponse } = require("../core/success/success.response")
const UploadService = require("../services/upload.service")

class UploadController {
    constructor() {
        this.uploadService = new UploadService()
    }
    uploadFileThumb = async (req, res, next) => {
        try {
            const { file } = req
            if (!file) {
                return next(new BadRequestError("Missing upload file"))
            }

            const { code, ...results } =
                await this.uploadService.uploadImageFromsLocal({
                    path: file.path,
                })

            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
}
module.exports = UploadController
