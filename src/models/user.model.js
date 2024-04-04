"use strict"

const { model, Schema, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "User"
const COLLECTION_NAME = "Users"

// Declare the Schema of the Mongo model
var userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        password: {
            type: String,
            required: true,
        },
        roles: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
)

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema)
