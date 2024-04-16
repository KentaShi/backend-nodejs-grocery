"use strict"
const ProductModel = require("../product.model")

const findAll = () => {}
const findById = () => {}
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
const deleteById = () => {}
module.exports = { findAll, findById, findBySlug, add, updateById, deleteById }
