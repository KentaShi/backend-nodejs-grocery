"use strict"

const {
    ConflictError,
    NotFoundError,
    BadRequestError,
} = require("../core/errors/app.error")
const CategoryRepository = require("../models/repositories/category.repo")
const ProductRepository = require("../models/repositories/product.repo")

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
                throw new ConflictError()
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
            throw error
        }
    }
    findAll = async () => {
        try {
            const categories = await this.categoryRepository.findAll()
            return {
                code: 200,
                categories,
            }
        } catch (error) {
            throw error
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
            throw error
        }
    }
    deleteById = async ({ cate_id }) => {
        try {
            const foundCate = await this.categoryRepository.findOne({ cate_id })
            if (!foundCate) {
                throw new NotFoundError()
            }
            const { cate_slug } = foundCate
            const products = await this.productRepository.findByCate({
                cate_slug,
            })
            if (products.length > 0) {
                throw new BadRequestError()
            }
            await this.categoryRepository.deleteById({ cate_id })
        } catch (error) {
            throw error
        }
    }
}

module.exports = CategoryService
