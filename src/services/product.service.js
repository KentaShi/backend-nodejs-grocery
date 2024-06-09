"use strict"

const { generateUniqueProductSlug, getInfoData } = require("../utils")

const ProductRepository = require("../models/repositories/product.repo")
const {
    BadRequestResponse,
    ErrorResponse,
} = require("../response/error.response")
const { AppError } = require("../errors/app.error")
class ProductSerive {
    constructor() {
        this.productRepository = new ProductRepository()
    }
    add = async (data) => {
        try {
            const {
                product_name,
                product_thumb,
                product_price,
                product_unit,
                product_cate,
            } = data
            if (
                !product_name ||
                !product_thumb ||
                !product_price ||
                !product_unit ||
                !product_cate
            ) {
                return {
                    code: 304,
                    message: "Please fill all required fields",
                }
            }
            const product_slug = await generateUniqueProductSlug(
                product_name,
                this.productRepository
            )
            const newProduct = await this.productRepository.add({
                product_name,
                product_thumb,
                product_price,
                product_unit,
                product_cate,
                product_slug,
            })

            return {
                code: 200,
                product: getInfoData({
                    fields: [
                        "product_name",
                        "product_thumb",
                        "product_price",
                        "product_unit",
                        "product_slug",
                        "product_cate",
                    ],
                    object: newProduct,
                }),
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }
    findAll = async () => {
        try {
            const products = await this.productRepository.findAll()
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
    findById = async ({ product_id }) => {
        try {
            const product = await this.productRepository.findById({
                product_id,
            })
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
    findByCategory = async ({ cate_slug }) => {
        try {
            const products = await this.productRepository.findByCate({
                cate_slug,
            })
            if (products.length > 0) {
                return {
                    code: 200,
                    products,
                }
            }
            return {
                code: 404,
            }
        } catch (error) {
            throw new AppError(error.message)
        }
    }

    delete = async ({ product_id }) => {
        try {
            const isExists = await this.productRepository.isExistById({
                product_id,
            })
            if (isExists) {
                await this.productRepository.deleteById({ product_id })
                return {
                    code: 200,
                    message: "Xóa thành công",
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
    update = async (product_id, data) => {
        try {
            const isExists = await this.productRepository.isExistById({
                product_id,
            })
            if (isExists) {
                await this.productRepository.updateById(product_id, data)
                return {
                    code: 200,
                    message: "Update product successfully.",
                }
            }
            return { code: 404, message: "Product does not exist" }
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)
        }
    }
    searchProducts = async (query) => {
        try {
            const products = await this.productRepository.search(query)
            if (products.length > 0) {
                return {
                    code: 200,
                    products,
                }
            }
            return {
                code: 404,
            }
        } catch (error) {
            throw new AppError()
        }
    }
}

module.exports = ProductSerive
