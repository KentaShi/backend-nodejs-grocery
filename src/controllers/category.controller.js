"use strict"

const {
    AppError,
    ConflictError,
    NotFoundError,
    BadRequestError,
} = require("../core/errors/app.error")
const { SuccessResponse } = require("../core/success/success.response")
const CategoryService = require("../services/category.service")

class CategoryController {
    constructor() {
        this.categoryService = new CategoryService()
    }
    create = async (req, res, next) => {
        try {
            const { code, ...results } = await this.categoryService.create(
                req.body
            )
            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
    deleteById = async (req, res, next) => {
        try {
            const { id } = req.params
            await this.categoryService.deleteById({
                cate_id: id,
            })

            return new SuccessResponse().send(res)
        } catch (error) {
            next(error)
        }
    }

    findAllCategories = async (req, res, next) => {
        try {
            const { code, ...results } = await this.categoryService.findAll()

            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
    getCountOfProductsByCate = async (req, res, next) => {
        try {
            const { cate_slug } = req.params
            const { code, count } =
                await this.categoryService.getCountOfProductsByCateSlug({
                    cate_slug,
                })
            return new SuccessResponse({
                message: "success",
                metadata: { count },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CategoryController
