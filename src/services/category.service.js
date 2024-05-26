"use strict"

const CategoryRepository = require("../models/repositories/category.repo")
const { generateCategorySlug } = require("../utils")

class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository()
    }

    create = async ({ cate_name }) => {
        try {
            const cate_slug = generateCategorySlug({ cate_name })
            const category = await this.categoryRepository.create({
                cate_name,
                cate_slug,
            })
            return {
                code: 200,
                category: category,
            }
        } catch (error) {
            console.log(error)
            return {
                code: 500,
                message: "Error creating category",
            }
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
            console.log(error)
            return {
                code: 500,
                message: "Error find all categories",
            }
        }
    }
}

module.exports = CategoryService
