"use strict"

const CategoryRepository = require("../models/repositories/category.repo")
const ProductRepository = require("../models/repositories/product.repo")
const {
    NotFoundResponse,
    BadRequestResponse,
} = require("../response/error.response")
const { generateCategorySlug } = require("../utils")

class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository()
        this.productRepository = new ProductRepository()
    }

    create = async ({ cate_name }) => {
        try {
            const cate_slug = generateCategorySlug({ cate_name })
            const cateExits = await this.categoryRepository.isExistByCateSlug({
                cate_slug,
            })
            if (cateExits) {
                return {
                    code: 409,
                }
            }
            const category = await this.categoryRepository.create({
                cate_name,
                cate_slug,
            })
            return {
                code: 200,
                category: category,
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
    findAll = async () => {
        try {
            const categories = await this.categoryRepository.findAll()
            if (categories.length > 0) {
                return {
                    code: 200,
                    categories,
                }
            }
            return {
                code: 404,
                message: "No category found",
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
    getCountOfProductsByCateSlug = async ({ cate_slug }) => {
        try {
            const products = await this.productRepository.findByCate({
                cate_slug,
            })
            return {
                code: 200,
                count: products.length,
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
    deleteOne = async ({ cate_id }) => {
        try {
            const foundCate = await this.categoryRepository.findOne({ cate_id })
            if (!foundCate) {
                return { code: 404, message: "Not Found category" }
            }
            const { cate_slug } = foundCate
            const products = await this.productRepository.findByCate({
                cate_slug,
            })
            if (products.length > 0) {
                return {
                    code: 400,
                    message: "Có sản phẩm thuộc phân loại này, không thể xóa",
                }
            }
            await this.categoryRepository.deleteById({ cate_id })
            return { code: 200, message: "Xóa thành công" }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = CategoryService
