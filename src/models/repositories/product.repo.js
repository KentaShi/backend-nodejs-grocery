"use strict"
const ProductModel = require("../product.model")

class ProductRepository {
    findAll = async () => {
        return await ProductModel.find().lean()
    }
    findById = async ({ product_id }) => {
        return await ProductModel.findById(product_id).lean()
    }
    findBySlug = async ({ slug }) => {
        return await ProductModel.findOne({ product_slug: slug }).lean()
    }
    findByCate = async ({ cate_slug }) => {
        return await ProductModel.find({ product_cate: cate_slug }).lean()
    }
    add = async ({
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
    updateById = async (id, data) => {
        return await ProductModel.updateOne(
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
        await ProductModel.deleteOne({ _id: product_id })
    }
    search = async (query) => {
        return await ProductModel.find({
            $text: {
                $search: query,
            },
        }).lean()
    }
}

module.exports = ProductRepository
