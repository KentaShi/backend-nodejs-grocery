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
const updateById = async (data) => {
    await ProductModel.updateOne(
        { _id: data.product_id },
        {
            product_name: data.product_name,
            product_price: data.product_price,
            product_cate: data.product_cate,
            product_thumb: data.product_thumb,
        }
    )
}
const deleteById = async ({ product_id }) => {
    await ProductModel.deleteOne({ _id: product_id })
}
module.exports = { findAll, findById, findBySlug, add, updateById, deleteById }
