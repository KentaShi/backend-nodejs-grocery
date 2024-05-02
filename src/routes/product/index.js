"use strict"

const express = require("express")
const router = express.Router()
const ProductController = require("../../controllers/product.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { productValidator, searchValidator } = require("../../helpers/validator")
const { validate } = require("../../middlewares/validate")
const { authenticate } = require("../../middlewares/auth")

//search
router.get(
    "/search",
    searchValidator,
    validate,
    asyncHandler(ProductController.searchProduct)
)

//fetch all products
router.get("/all", asyncHandler(ProductController.fetchAllProducts))

//fetch products by category
router.get(
    "/category/:cat",
    asyncHandler(ProductController.fetchProductByCategory)
)

//fetch product by id
router.get("/:id", asyncHandler(ProductController.fetchProductById))

router.use(authenticate)

//add new product
router.post(
    "/",
    productValidator,
    validate,
    asyncHandler(ProductController.addNewProduct)
)

//update product by id
router.put(
    "/:id",
    productValidator,
    validate,
    asyncHandler(ProductController.updateProductById)
)

//delete product by id
router.delete("/:id", asyncHandler(ProductController.deleteProductById))

module.exports = router
