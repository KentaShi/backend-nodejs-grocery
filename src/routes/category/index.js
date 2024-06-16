"use strict"

const express = require("express")
const CategoryController = require("../../controllers/category.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { validate } = require("../../middlewares/validate")
const { categoryValidator } = require("../../helpers/validator")
const { authenticate } = require("../../middlewares/auth")
const router = express.Router()

const categoryController = new CategoryController()

//authenticate
router.use(authenticate)

//get all categories
router.get("/all", asyncHandler(categoryController.findAllCategories))

//get count of products by category
router.get(
    "/:cate_slug/count",
    asyncHandler(categoryController.getCountOfProductsByCate)
)

//add new category
router.post(
    "/",
    categoryValidator,
    validate,
    asyncHandler(categoryController.create)
)

//delete category
router.delete("/:id", asyncHandler(categoryController.deleteById))

module.exports = router
