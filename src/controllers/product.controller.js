"use strict"

const {
    NotFoundResponse,
    ErrorResponse,
    NotModifiedResponse,
} = require("../response/error.response")
const { SuccessResponse } = require("../response/success.response")
const ProductSerive = require("../services/product.service")

class ProductController {
    static fetchAllProducts = async (req, res, next) => {
        const { code, ...results } = await ProductSerive.findAll()
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
    static fetchProductById = async (req, res, next) => {}
    static fetchProductByCategory = async (req, res, next) => {
        const { cat } = req.params
        const { code, ...results } = await ProductSerive.findByCategory(cat)
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: `Found products by ${cat}`,
                    metadata: results,
                }).send(res)
            case 304:
                return new NotModifiedResponse({
                    message: results?.message,
                }).send(res)
            default:
                return new ErrorResponse({ message: results?.message }).send(
                    res
                )
        }
    }
    static addNewProduct = async (req, res, next) => {
        const { code, ...results } = await ProductSerive.add(req.body)
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: "Created product successfully",
                    metadata: results,
                }).send(res)
            case 304:
                return new NotModifiedResponse({
                    message: results?.message,
                }).send(res)
            default:
                return new ErrorResponse({ message: results?.message }).send(
                    res
                )
        }
    }
    static updateProductById = async (req, res, next) => {
        const { id } = req.params
        const data = req.body
        const { code, ...results } = await ProductSerive.update(id, data)
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: results?.message
                        ? results.message
                        : "Update product successfully",
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
    static deleteProductById = async (req, res, next) => {
        const { id } = req.params
        const { code, ...results } = await ProductSerive.delete({
            product_id: id,
        })
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: "Delete product successfully",
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
    static searchProduct = async (req, res, next) => {
        try {
            const query = req.query.q
            const { code, ...results } = await ProductSerive.searchProducts(
                query
            )
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        message: "Found products",
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
}

module.exports = ProductController
