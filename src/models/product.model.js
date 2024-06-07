"use strict"

const { model, Schema, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Product"
const COLLECTION_NAME = "Products"

// Declare the Schema of the Mongo model
var productSchema = new Schema(
    {
        product_name: {
            type: String,
            required: true,
        },
        product_thumb: {
            type: String,
            required: true,
        },
        product_slug: String,
        product_price: {
            type: Number,
            required: true,
        },
        product_unit: {
            type: String,
            required: true,
            default: "",
        },
        product_cate: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
)

productSchema.index({ product_name: "text" })

//Export the model
module.exports = model(DOCUMENT_NAME, productSchema)
