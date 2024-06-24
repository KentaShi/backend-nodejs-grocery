"use strict"

const { NotFoundError, AppError } = require("../core/errors/app.error")

const { SuccessResponse } = require("../core/success/success.response")
const ProductServive = require("../services/product.service")

class ProductController {
    constructor() {
        this.productService = new ProductServive()
    }
    findAll = async (req, res, next) => {
        try {
            const { code, ...results } = await this.productService.findAll()
            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
    findById = async (req, res, next) => {}
    findByCategory = async (req, res, next) => {
        try {
            const { cat } = req.params
            const { code, ...results } =
                await this.productService.findByCateSlug(cat)

            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
    create = async (req, res, next) => {
        try {
            const { code, ...results } = await this.productService.create(
                req.body,
                req.file.path
            )

            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
    updateById = async (req, res, next) => {
        try {
            const { id } = req.params
            const data = req.body
            const { code, ...results } = await this.productService.updateById(
                id,
                data
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
            await this.productService.deleteById(id)

            return new SuccessResponse({}).send(res)
        } catch (error) {
            next(error)
        }
    }
    search = async (req, res, next) => {
        try {
            const query = req.query.q
            const { code, ...results } = await this.productService.search(query)

            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ProductController
