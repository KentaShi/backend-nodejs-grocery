"use strict"

const categoryModel = require("../category.model")

class CategoryRepository {
    create = async ({ cate_name, cate_slug }) => {
        return await categoryModel.create({
            cate_name,
            cate_slug,
        })
    }
    isExistByCateSlug = async ({ cate_slug }) => {
        return await categoryModel.exists({ cate_slug })
    }
    findAll = async () => {
        return await categoryModel.find().lean()
    }
    findById = async (cate_id) => {
        return await categoryModel.findOne({ _id: cate_id }).lean()
    }
    deleteById = async (cate_id) => {
        await categoryModel.deleteOne({ _id: cate_id })
    }
}

module.exports = CategoryRepository
