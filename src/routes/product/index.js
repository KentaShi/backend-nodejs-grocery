"use strict"

const express = require("express")
const router = express.Router()
const productController = require("../../controllers/product.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { productValidator } = require("../../helpers/validator")
const { validate } = require("../../middlewares/validate")

//fetch all products
router.get("/all", asyncHandler(productController.fetchAllProducts))

//fetch product by id
router.get("/:id", asyncHandler(productController.fetchProductById))

//search
router.get("/search/:query", asyncHandler(productController.searchProduct))

//add new product
router.post(
    "/",
    productValidator,
    validate,
    asyncHandler(productController.addNewProduct)
)

//update product by id
router.put(
    "/:id",
    productValidator,
    validate,
    asyncHandler(productController.updateProductById)
)

//delete product by id
router.delete("/:id", asyncHandler(productController.deleteProductById))

module.exports = router
