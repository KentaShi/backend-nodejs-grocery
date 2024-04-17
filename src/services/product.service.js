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
}
module.exports = ProductSerive
