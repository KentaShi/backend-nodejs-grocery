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
        try {
            const { code, error, ...results } =
                await this.productService.findAll()

            if (error) return next(error)

            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "Found products",
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
    fetchProductById = async (req, res, next) => {}
    fetchProductByCategory = async (req, res, next) => {
        try {
            const { cat } = req.params
            const { code, error, ...results } =
                await this.productService.findByCategory({
                    cate_slug: cat,
                })

            if (error) return next(error)

            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "success",
                        metadata: results,
                    }).send(res)
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }
    addNewProduct = async (req, res, next) => {
        try {
            const { code, error, ...results } = await this.productService.add(
                req.body
            )

            if (error) return next(error)

            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "success",
                        metadata: results,
                    }).send(res)
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }
    updateProductById = async (req, res, next) => {
        try {
            const { id } = req.params
            const data = req.body
            const { code, error, ...results } =
                await this.productService.update(id, data)

            if (error) return next(error)

            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: results?.message
                            ? results.message
                            : "Update product successfully",
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
    deleteProductById = async (req, res, next) => {
        try {
            const { id } = req.params
            const { code, error } = await this.productService.delete({
                product_id: id,
            })

            if (error) return next(error)

            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "success",
                        metadata: {},
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
    searchProduct = async (req, res, next) => {
        try {
            const query = req.query.q
            const { code, error, ...results } =
                await this.productService.searchProducts(query)

            if (error) return next(error)

            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "success",
                        metadata: results,
                    }).send(res)
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ProductController()
