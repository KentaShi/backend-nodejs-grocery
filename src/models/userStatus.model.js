"use strict"

const { model, Schema, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "UserStatus"
const COLLECTION_NAME = "UserStatus"

// Declare the Schema of the Mongo model
var userStatusSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            unique: true,
        },
        lastSeen: {
            type: Date,
            default: Date.now(),
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
)

//Export the model
module.exports = model(DOCUMENT_NAME, userStatusSchema)
