"use strict"

const { model, Schema, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Category"
const COLLECTION_NAME = "Categories"

// Declare the Schema of the Mongo model
var categorySchema = new Schema(
    {
        cate_name: {
            type: String,
            unique: true,
            required: true,
        },
        cate_slug: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
)

//Export the model
module.exports = model(DOCUMENT_NAME, categorySchema)
