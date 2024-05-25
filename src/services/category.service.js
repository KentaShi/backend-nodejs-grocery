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
}

module.exports = CategoryService
