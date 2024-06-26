"use strict"

const { generateUniqueProductSlug, getInfoData } = require("../utils")

const ProductRepository = require("../models/repositories/product.repo")
const { NotFoundError, BadRequestError } = require("../core/errors/app.error")
const UploadService = require("./upload.service")
class ProductSerive {
    constructor() {
        this.productRepository = new ProductRepository()
        this.uploadService = new UploadService()
    }
    create = async (data, imagePath) => {
        try {
            const { ...resUpload } =
                await this.uploadService.uploadImageFromsLocal(imagePath)

            try {
                const product_thumb = {
                    url: resUpload.url,
                    public_id: resUpload.public_id,
                }
                const {
                    product_name,
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
                            "_id",
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
                await this.uploadService.deleteImage(resUpload.public_id)
                throw error
            }
        } catch (error) {
            throw error
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
            throw error
        }
    }
    findById = async (product_id) => {
        try {
            const product = await this.productRepository.findById(product_id)
            if (!product) {
                throw new NotFoundError()
            }
            return {
                code: 200,
                product,
            }
        } catch (error) {
            throw error
        }
    }
    findByCateSlug = async (cate_slug) => {
        try {
            const products = await this.productRepository.findByCateSlug(
                cate_slug
            )
            return {
                code: 200,
                products,
            }
        } catch (error) {
            throw error
        }
    }

    deleteById = async (product_id) => {
        try {
            const product = await this.productRepository.findById(product_id)
            if (!product) throw new BadRequestError()

            const imagePublicId = product.product_thumb.public_id

            await this.uploadService.deleteImage(imagePublicId)

            await this.productRepository.deleteById(product_id)
        } catch (error) {
            throw error
        }
    }
    updateById = async (product_id, data) => {
        try {
            const isExists = await this.productRepository.isExistById(
                product_id
            )
            if (!isExists) throw new NotFoundError()
            const updatedProduct = await this.productRepository.updateById(
                product_id,
                data
            )

            return {
                code: 200,
                product: getInfoData({
                    fields: [
                        "_id",
                        "product_name",
                        "product_thumb",
                        "product_price",
                        "product_unit",
                        "product_slug",
                        "product_cate",
                    ],
                    object: updatedProduct,
                }),
            }
        } catch (error) {
            throw error
        }
    }
    search = async (query) => {
        try {
            const products = await this.productRepository.search(query)

            return {
                code: 200,
                products,
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = ProductSerive
