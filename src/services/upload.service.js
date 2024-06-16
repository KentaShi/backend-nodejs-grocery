"use strict"

const cloudinary = require("../config/cloudinary.config")

class UploadService {
    uploadImageFromsLocal = async ({ path }) => {
        try {
            const result = await cloudinary.uploader.upload(path, {
                // public_id: "thumb",
                folder: "taphoachituyet",
            })
            return {
                code: 200,
                image_url: result.secure_url,
                thumb_url: await cloudinary.url(result.public_id, {
                    width: 100,
                    height: 100,
                    format: "jpg",
                }),
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = UploadService
