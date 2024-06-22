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
                url: result.secure_url,
                public_id: result.public_id,
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
    deleteImage = async (public_id) => {
        try {
            const result = await cloudinary.uploader.destroy(public_id)
            console.log("Delete image from cloudinary successfully", result)
        } catch (error) {
            throw error
        }
    }
}

module.exports = UploadService
