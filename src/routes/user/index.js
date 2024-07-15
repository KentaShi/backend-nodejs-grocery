"use strict"

const express = require("express")

const asyncHandler = require("../../helpers/asyncHandler")
const { authenticate } = require("../../middlewares/auth")
const UserController = require("../../controllers/user.controller")
const { updateUserStatus } = require("../../middlewares/updateUserStatus")
const UserStatusController = require("../../controllers/userStatus.controller")
const router = express.Router()
const userController = new UserController()
const userStatusController = new UserStatusController()
//authenticate
router.use(authenticate, updateUserStatus)

//get all users
router.get("/", asyncHandler(userController.findAll))

//get status of user
router.get("/:userId/status", asyncHandler(userStatusController.getStatus))

module.exports = router
