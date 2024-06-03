"use strict"

const {
    ErrorResponse,
    NotFoundResponse,
    ConflictResponse,
    BadRequestResponse,
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
                        message: "Thêm thành công",
                        metadata: results,
                    }).send(res)
                case 409:
                    return new ConflictResponse({
                        message: "Đã có phân loại này",
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
    deleteCateById = async (req, res, next) => {
        try {
            const { id } = req.params
            const { code, message } = await this.categoryService.deleteOne({
                cate_id: id,
            })
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "Xóa thành công",
                        metadata: null,
                    }).send(res)
                case 404:
                    return new NotFoundResponse({
                        message: message,
                    }).send(res)
                case 400:
                    return new BadRequestResponse({
                        message: message,
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
    getCountOfProductsByCate = async (req, res, next) => {
        try {
            const { cate_slug } = req.params
            const { code, count } =
                await this.categoryService.getCountOfProductsByCateSlug({
                    cate_slug,
                })
            if (code === 200) {
                return new SuccessResponse({
                    message: "",
                    metadata: { count },
                }).send(res)
            }
            throw new Error("Couldn't get count of products")
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CategoryController()
