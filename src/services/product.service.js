"use strict"

const { generateUniqueProductSlug, getInfoData } = require("../utils")

const productRepository = require("../models/repositories/product.repo")
class ProductSerive {
    static add = async (data) => {
        try {
            const { product_name, product_thumb, product_price, product_cate } =
                data
            if (
                !product_name ||
                !product_thumb ||
                !product_price ||
                !product_cate
            ) {
                return {
                    code: 304,
                    message: "Please fill all required fields",
                }
            }
            const product_slug = await generateUniqueProductSlug(
                product_name,
                productRepository
            )
            const newProduct = await productRepository.add({
                product_name,
                product_thumb,
                product_price,
                product_cate,
                product_slug,
            })
            if (newProduct) {
                return {
                    code: 200,
                    product: getInfoData({
                        fields: [
                            "product_name",
                            "product_thumb",
                            "product_price",
                            "product_slug",
                            "product_cate",
                        ],
                        object: newProduct,
                    }),
                }
            }
            return {
                code: 304,
                message: "Error creating product",
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }
    static findAll = async () => {
        try {
            const products = await productRepository.findAll()
            if (products.length > 0) {
                return {
                    code: 200,
                    products,
                }
            }
            return {
                code: 404,
                message: "List of products is empty",
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }
    static findById = async ({ product_id }) => {
        try {
            const product = await productRepository.findById({ product_id })
            if (!product) {
                return {
                    code: 404,
                    message: "Product not found",
                }
            }
            return {
                code: 200,
                product,
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }
    static findByCategory = async ({ cate_slug }) => {
        try {
            const products = await productRepository.findByCate({ cate_slug })
            if (products.length > 0) {
                return {
                    code: 200,
                    products,
                }
            }
            return {
                code: 404,
                message: `Not Found product with category:${category}`,
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }

    static delete = async ({ product_id }) => {
        try {
            const isExists = await checkProductExists(product_id)
            if (isExists) {
                await productRepository.deleteById({ product_id })
                return {
                    code: 200,
                    message: "Delete product successfully",
                }
            }
            return { code: 404, message: "Product does not exist" }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }
    static update = async (product_id, data) => {
        try {
            const isExists = await checkProductExists(product_id)
            if (isExists) {
                await productRepository.updateById(product_id, data)
                return {
                    code: 200,
                    message: "Update product successfully.",
                }
            }
            return { code: 404, message: "Product does not exist" }
        } catch (error) {
            console.log(error)
            return {
                code: 500,
                message: error.message,
            }
        }
    }
    static searchProducts = async (query) => {
        try {
            const products = await productRepository.search(query)
            if (products.length > 0) {
                return {
                    code: 200,
                    products,
                }
            }
            return {
                code: 404,
                message: `Not Found product with query ${query}`,
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }
}

const checkProductExists = async (product_id) => {
    const product = await productRepository.findById({ product_id })
    return product ? true : false
}

module.exports = ProductSerive
