"use strict"

const {
    ErrorResponse,
    NotFoundResponse,
} = require("../response/error.response")
const { SuccessResponse } = require("../response/success.response")
const CategoryService = require("../services/category.service")

class CategoryController {
    constructor() {
        this.categoryService = new CategoryService()
    }
    addNewCate = async (req, res, next) => {
        try {
            const { code, ...results } = await this.categoryService.create(
                req.body
            )
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: `Created category successfully`,
                        metadata: results,
                    }).send(res)
                default:
                    return new ErrorResponse({
                        message: results?.message,
                    }).send(res)
            }
        } catch (error) {
            next(error)
        }
    }
    findAllCategories = async (req, res, next) => {
        const { code, ...results } = await this.categoryService.findAll()
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: `Found categories`,
                    metadata: results,
                }).send(res)
            case 404:
                return new NotFoundResponse({
                    message: results?.message,
                }).send(res)
            default:
                return new ErrorResponse({
                    message: results?.message,
                }).send(res)
        }
    }
}

module.exports = new CategoryController()
