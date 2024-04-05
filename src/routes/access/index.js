"use strict"
const router = require("express").Router()
const asyncHandler = require("../../helpers/asyncHandler")
const accessController = require("../../controllers/access.controller")
const { verifyAccessToken, authenticate } = require("../../middlewares/auth")

// sign up
router.post("/register", asyncHandler(accessController.register))

//login
router.post("/login", asyncHandler(accessController.login))

//authenticate
router.use(authenticate)

//refresh token
router.post("/refresh-token", asyncHandler(accessController.refreshToken))

//logout
router.post("/logout", asyncHandler(accessController.logout))

module.exports = router
