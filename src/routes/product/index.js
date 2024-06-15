"use strict"

const express = require("express")
const router = express.Router()
const ProductController = require("../../controllers/product.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { productValidator, searchValidator } = require("../../helpers/validator")
const { validate } = require("../../middlewares/validate")
const { authenticate } = require("../../middlewares/auth")

const productController = new ProductController()

router.use(authenticate)

//search
router.get(
    "/search",
    searchValidator,
    validate,
    asyncHandler(productController.searchProduct)
)

//fetch all products
router.get("/all", asyncHandler(productController.fetchAllProducts))

//fetch products by category
router.get(
    "/category/:cat",
    asyncHandler(productController.fetchProductByCategory)
)

//fetch product by id
router.get("/:id", asyncHandler(productController.fetchProductById))

//add new product
router.post(
    "/",
    productValidator,
    validate,
    asyncHandler(productController.create)
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
