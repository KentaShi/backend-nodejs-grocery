"use strict"

const {
    NotFoundResponse,
    ErrorResponse,
    NotModifiedResponse,
} = require("../response/error.response")
const { SuccessResponse } = require("../response/success.response")
const { default: ProductSerive } = require("../services/product.service")

const fetchAllProducts = async (req, res, next) => {
    const { code, ...results } = await ProductSerive.findAll()
    switch (code) {
        case 200:
            return new SuccessResponse({
                message: "Found products",
                metadata: results,
            }).send(res)
        case 404:
            return new NotFoundResponse({ message: results?.message }).send(res)
        default:
            return new ErrorResponse({ message: results?.message }).send(res)
    }
}
const fetchProductById = async (req, res, next) => {}
const addNewProduct = async (req, res, next) => {
    const { code, ...results } = await ProductSerive.add(req.body)
    switch (code) {
        case 200:
            return new SuccessResponse({
                message: "Created product successfully",
                metadata: results,
            }).send(res)
        case 304:
            return new NotModifiedResponse({ message: results?.message }).send(
                res
            )
        default:
            return new ErrorResponse({ message: results?.message }).send(res)
    }
}
const updateProductById = async (req, res, next) => {}
const deleteProductById = async (req, res, next) => {}

module.exports = {
    fetchAllProducts,
    fetchProductById,
    addNewProduct,
    updateProductById,
    deleteProductById,
}
