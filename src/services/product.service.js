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
            return { error }
        }
    }
    findAll = async () => {
        try {
            const products = await this.productRepository.findAll()
            return {
                code: 200,
                products,
            }
        } catch (error) {
            return { error }
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
                }
            }
            return {
                code: 200,
                product,
            }
        } catch (error) {
            return { error }
        }
    }
    findByCategory = async ({ cate_slug }) => {
        try {
            const products = await this.productRepository.findByCate({
                cate_slug,
            })
            return {
                code: 200,
                products,
            }
        } catch (error) {
            return { error }
        }
    }

    delete = async ({ product_id }) => {
        try {
            const isExists = await this.productRepository.isExistById({
                product_id,
            })
            if (!isExists) return { code: 404 }

            await this.productRepository.deleteById({ product_id })

            return {
                code: 200,
            }
        } catch (error) {
            return { error }
        }
    }
    update = async (product_id, data) => {
        try {
            const isExists = await this.productRepository.isExistById({
                product_id,
            })
            if (!isExists) return { code: 404 }

            await this.productRepository.updateById(product_id, data)
            return {
                code: 200,
            }
        } catch (error) {
            return { error }
        }
    }
    searchProducts = async (query) => {
        try {
            const products = await this.productRepository.search(query)

            return {
                code: 200,
                products,
            }
        } catch (error) {
            return { error }
        }
    }
}

module.exports = ProductSerive
