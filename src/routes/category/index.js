"use strict"

const express = require("express")
const categoryController = require("../../controllers/category.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { validate } = require("../../middlewares/validate")
const { categoryValidator } = require("../../helpers/validator")
const router = express.Router()

//add new category
router.post(
    "/",
    categoryValidator,
    validate,
    asyncHandler(categoryController.addNewCate)
)

module.exports = router
