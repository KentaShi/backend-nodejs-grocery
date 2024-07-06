"use strict"

const express = require("express")

const asyncHandler = require("../../helpers/asyncHandler")
const { authenticate } = require("../../middlewares/auth")
const UserController = require("../../controllers/user.controller")
const { updateUserStatus } = require("../../middlewares/updateUserStatus")
const router = express.Router()
const userController = new UserController()
//authenticate
router.use(authenticate, updateUserStatus)

//get all users
router.get("/", asyncHandler(userController.findAll))

module.exports = router
