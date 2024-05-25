"use strict"

const categoryModel = require("../category.model")

class CategoryRepository {
    create = async ({ cate_name, cate_slug }) => {
        return await categoryModel.create({
            cate_name,
            cate_slug,
        })
    }
}

module.exports = CategoryRepository
