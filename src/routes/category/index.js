"use strict"

const express = require("express")
const CategoryController = require("../../controllers/category.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { validate } = require("../../middlewares/validate")
const { categoryValidator } = require("../../helpers/validator")
const { authenticate } = require("../../middlewares/auth")
const { updateUserStatus } = require("../../middlewares/updateUserStatus")
const router = express.Router()

const categoryController = new CategoryController()

//get all categories
router.get("/", asyncHandler(categoryController.findAllCategories))

//get count of products by category
router.get(
    "/:cate_slug/count",
    asyncHandler(categoryController.getCountOfProductsByCate)
)

//authenticate
router.use(authenticate, updateUserStatus)

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
