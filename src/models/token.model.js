"use strict"

const { Schema, model } = require("mongoose") // Erase if already required
const DOCUMENT_NAME = "Token"
const COLLECTION_NAME = "Tokens"
// Declare the Schema of the Mongo model
var tokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        refreshToken: {
            type: String,
            required: true,
        },
        refreshTokensUsed: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
)

//Export the model
module.exports = model(DOCUMENT_NAME, tokenSchema)
