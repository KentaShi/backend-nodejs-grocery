"use strict"

const express = require("express")
const categoryController = require("../../controllers/category.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { validate } = require("../../middlewares/validate")
const { categoryValidator } = require("../../helpers/validator")
const router = express.Router()

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
    asyncHandler(categoryController.addNewCate)
)

//delete category
router.delete("/:id", asyncHandler(categoryController.deleteCateById))

module.exports = router
