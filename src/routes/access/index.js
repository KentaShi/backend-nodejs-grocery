"use strict"
const router = require("express").Router()
const asyncHandler = require("../../helpers/asyncHandler")
const accessController = require("../../controllers/access.controller")
const { authenticate } = require("../../middlewares/auth")

// sign up
router.post("/register", asyncHandler(accessController.register))

//login
router.post("/login", asyncHandler(accessController.login))

//refresh token
router.post("/refresh-token", asyncHandler(accessController.refreshToken))

//authenticate
router.use(authenticate)

//logout
router.post("/logout", asyncHandler(accessController.logout))

module.exports = router
