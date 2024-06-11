"use strict"

const {
    AppError,
    ConflictError,
    NotFoundError,
    BadRequestError,
} = require("../errors/app.error")
const { SuccessResponse } = require("../response/success.response")
const CategoryService = require("../services/category.service")

class CategoryController {
    constructor() {
        this.categoryService = new CategoryService()
    }
    addNewCate = async (req, res, next) => {
        try {
            const { code, error, ...results } =
                await this.categoryService.create(req.body)
            if (error) return next(error)
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "Thêm thành công",
                        metadata: results,
                    }).send(res)
                case 409:
                    return next(new ConflictError("conflict"))
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }
    deleteCateById = async (req, res, next) => {
        try {
            const { id } = req.params
            const { code, error } = await this.categoryService.deleteOne({
                cate_id: id,
            })
            if (error) return next(error)
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "Xóa thành công",
                        metadata: null,
                    }).send(res)
                case 404:
                    return next(new NotFoundError())
                case 400:
                    return next(new BadRequestError())
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }

    findAllCategories = async (req, res, next) => {
        try {
            const { code, error, ...results } =
                await this.categoryService.findAll()
            if (error) return next(error)
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "success",
                        metadata: results,
                    }).send(res)
                case 404:
                    return next(new NotFoundError())
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }
    getCountOfProductsByCate = async (req, res, next) => {
        try {
            const { cate_slug } = req.params
            const { code, error, count } =
                await this.categoryService.getCountOfProductsByCateSlug({
                    cate_slug,
                })

            if (error) return next(error)
            if (code === 200) {
                return new SuccessResponse({
                    message: "success",
                    metadata: { count },
                }).send(res)
            }
            return next(new AppError())
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CategoryController()
