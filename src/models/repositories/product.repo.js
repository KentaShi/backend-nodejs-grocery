"use strict"
const productModel = require("../product.model")

class ProductRepository {
    findAll = async () => {
        return await productModel.find().lean()
    }
    findById = async ({ product_id }) => {
        return await productModel.findById(product_id).lean()
    }
    findBySlug = async ({ slug }) => {
        return await productModel.findOne({ product_slug: slug }).lean()
    }
    findByCate = async ({ cate_slug }) => {
        return await productModel.find({ product_cate: cate_slug }).lean()
    }
    isExistById = async ({ product_id }) => {
        return await productModel.exists({ _id: product_id })
    }
    add = async ({
        product_name,
        product_thumb,
        product_price,
        product_cate,
        product_slug,
    }) => {
        return await productModel.create({
            product_name,
            product_thumb,
            product_price,
            product_cate,
            product_slug,
        })
    }
    updateById = async (id, data) => {
        return await productModel.updateOne(
            { _id: id },
            {
                $set: {
                    product_name: data.product_name,
                    product_price: data.product_price,
                    product_cate: data.product_cate,
                    product_thumb: data.product_thumb,
                },
            }
        )
    }
    deleteById = async ({ product_id }) => {
        await productModel.deleteOne({ _id: product_id })
    }
    search = async (query) => {
        return await productModel
            .find({
                $text: {
                    $search: query,
                },
            })
            .lean()
    }
}

module.exports = ProductRepository
