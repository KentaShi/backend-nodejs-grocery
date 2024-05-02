"use strict"
const router = require("express").Router()
const asyncHandler = require("../../helpers/asyncHandler")
const AccessController = require("../../controllers/access.controller")
const { authenticate, verifyAccessToken } = require("../../middlewares/auth")
const { loginValidator, registerValidator } = require("../../helpers/validator")
const { validate } = require("../../middlewares/validate")

// sign up
router.post(
    "/register",
    registerValidator,
    validate,
    asyncHandler(AccessController.register)
)

//login
router.post(
    "/login",
    loginValidator,
    validate,
    asyncHandler(AccessController.login)
)

//get authenticated
router.post("/getAuth", asyncHandler(AccessController.getAuth))

//refresh token
router.post("/refresh-token", asyncHandler(AccessController.refreshToken))

//authenticate
router.use(authenticate)

//logout
router.post("/logout", asyncHandler(AccessController.logout))

module.exports = router
