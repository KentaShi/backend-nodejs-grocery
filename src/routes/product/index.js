"use strict"

const express = require("express")
const router = express.Router()
const productController = require("../../controllers/product.controller")
const asyncHandler = require("../../helpers/asyncHandler")

//fetch all products
router.get("/all", asyncHandler(productController.fetchAllProducts))

//fetch product by id
router.get("/:id", asyncHandler(productController.fetchProductById))

//add new product
router.post("/", asyncHandler(productController.addNewProduct))

//update product by id
router.put("/:id", asyncHandler(productController.updateProductById))

//delete product by id
router.delete("/:id", asyncHandler(productController.deleteProductById))

module.exports = router
