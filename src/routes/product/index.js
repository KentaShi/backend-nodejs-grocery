"use strict"

const express = require("express")
const router = express.Router()
const ProductController = require("../../controllers/product.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const {
    searchValidator,
    createProductValidator,
    updateProductValidator,
} = require("../../helpers/validator")
const { validate } = require("../../middlewares/validate")
const { authenticate } = require("../../middlewares/auth")
const { uploadDisk } = require("../../config/multer.config")
const { updateUserStatus } = require("../../middlewares/updateUserStatus")

const productController = new ProductController()
//fetch all products
router.get("", asyncHandler(productController.findAll))

//fetch products for homepage
router.get("/categories", asyncHandler(productController.findByCategries))

//fetch products by category
router.get("/category/:cat", asyncHandler(productController.findByCategory))

//search
router.get(
    "/search",
    searchValidator,
    validate,
    asyncHandler(productController.search)
)

//authenticate
router.use(authenticate, updateUserStatus)

//fetch all products
router.get("", asyncHandler(productController.findAll))

//fetch product by id
router.get("/:id", asyncHandler(productController.findById))

//add new product
router.post(
    "/",
    uploadDisk.single("file"),
    createProductValidator,
    validate,
    asyncHandler(productController.create)
)

//update product by id
router.put(
    "/:id",
    updateProductValidator,
    validate,
    asyncHandler(productController.updateById)
)

//delete product by id
router.delete("/:id", asyncHandler(productController.deleteById))

module.exports = router
