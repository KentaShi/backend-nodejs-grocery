"use strict"

const { model, Schema, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "User"
const COLLECTION_NAME = "Users"

// Declare the Schema of the Mongo model
var userSchema = new Schema(
    {
        avatar: {
            public_id: {
                type: String,
                default: "",
            },
            url: {
                type: String,
                default: "",
            },
        },
        username: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user", "guest"],
            default: "guest",
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
)

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema)
