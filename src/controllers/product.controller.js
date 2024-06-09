"use strict"

const { NotFoundError, AppError } = require("../errors/app.error")
const {
    NotFoundResponse,
    ErrorResponse,
    NotModifiedResponse,
} = require("../response/error.response")
const { SuccessResponse } = require("../response/success.response")
const ProductServive = require("../services/product.service")

class ProductController {
    constructor() {
        this.productService = new ProductServive()
    }
    fetchAllProducts = async (req, res, next) => {
        const { code, ...results } = await this.productService.findAll()
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: "Found products",
                    metadata: results,
                }).send(res)
            case 404:
                return new NotFoundResponse({ message: results?.message }).send(
                    res
                )
            default:
                return new ErrorResponse({ message: results?.message }).send(
                    res
                )
        }
    }
    fetchProductById = async (req, res, next) => {}
    fetchProductByCategory = async (req, res, next) => {
        try {
            const { cat } = req.params
            const { code, ...results } =
                await this.productService.findByCategory({
                    cate_slug: cat,
                })
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "success",
                        metadata: results,
                    }).send(res)
                case 404:
                    throw new NotFoundError()
                default:
                    throw new AppError()
            }
        } catch (error) {
            next(error)
        }
    }
    addNewProduct = async (req, res, next) => {
        const { code, ...results } = await this.productService.add(req.body)
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: "Thêm thành công",
                    metadata: results,
                }).send(res)
            default:
                return new ErrorResponse({ message: results?.message }).send(
                    res
                )
        }
    }
    updateProductById = async (req, res, next) => {
        try {
            const { id } = req.params
            const data = req.body
            const { code, ...results } = await this.productService.update(
                id,
                data
            )
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: results?.message
                            ? results.message
                            : "Update product successfully",
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
        } catch (error) {
            next(error)
        }
    }
    deleteProductById = async (req, res, next) => {
        const { id } = req.params
        const { code, ...results } = await this.productService.delete({
            product_id: id,
        })
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: "Xóa thành công",
                    metadata: results,
                }).send(res)
            case 404:
                return new NotFoundResponse({ message: results?.message }).send(
                    res
                )
            default:
                return new ErrorResponse({ message: results?.message }).send(
                    res
                )
        }
    }
    searchProduct = async (req, res, next) => {
        try {
            const query = req.query.q
            const { code, ...results } =
                await this.productService.searchProducts(query)
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "success",
                        metadata: results,
                    }).send(res)
                case 404:
                    throw new NotFoundError()
                default:
                    throw new AppError()
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ProductController()
