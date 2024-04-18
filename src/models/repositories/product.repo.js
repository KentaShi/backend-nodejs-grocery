"use strict"
const ProductModel = require("../product.model")

const findAll = async () => {
    return await ProductModel.find().lean()
}
const findById = async ({ product_id }) => {
    return await ProductModel.findById(product_id).lean()
}
const findBySlug = async ({ slug }) => {
    return await ProductModel.findOne({ product_slug: slug }).lean()
}
const add = async ({
    product_name,
    product_thumb,
    product_price,
    product_cate,
    product_slug,
}) => {
    return await ProductModel.create({
        product_name,
        product_thumb,
        product_price,
        product_cate,
        product_slug,
    })
}
const updateById = () => {}
const deleteById = async ({ product_id }) => {
    await ProductModel.deleteOne({ _id: product_id })
}
module.exports = { findAll, findById, findBySlug, add, updateById, deleteById }
