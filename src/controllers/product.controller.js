"use strict"

const { default: ProductSerive } = require("../services/product.service")

const fetchAllProducts = async (req, res, next) => {}
const fetchProductById = async (req, res, next) => {}
const addNewProduct = async (req, res, next) => {
    const { code, ...results } = await ProductSerive.add(req.body)
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
