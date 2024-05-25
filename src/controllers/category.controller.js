"use strict"

const { ErrorResponse } = require("../response/error.response")
const { SuccessResponse } = require("../response/success.response")
const CategoryService = require("../services/category.service")

class CategoryController {
    constructor() {
        this.categoryService = new CategoryService()
    }
    addNewCate = async (req, res, next) => {
        const { code, ...results } = await this.categoryService.create(req.body)
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: `Created category successfully`,
                    metadata: results,
                }).send(res)
            default:
                return new ErrorResponse({ message: results?.message })
        }
    }
}

module.exports = new CategoryController()
