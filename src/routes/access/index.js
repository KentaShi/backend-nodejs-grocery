"use strict"
const router = require("express").Router()
const asyncHandler = require("../../helpers/asyncHandler")
const AccessController = require("../../controllers/access.controller")

const { authenticate, verifyAccessToken } = require("../../middlewares/auth")
const { loginValidator, registerValidator } = require("../../helpers/validator")
const { validate } = require("../../middlewares/validate")

const accessController = new AccessController()
// sign up
router.post(
    "/register",
    registerValidator,
    validate,
    asyncHandler(accessController.register)
)

//login
router.post(
    "/login",
    loginValidator,
    validate,
    asyncHandler(accessController.login)
)

//get authenticated
router.post("/getAuth", asyncHandler(accessController.getAuth))

//refresh token
router.post("/refresh-token", asyncHandler(accessController.refreshToken))

//authenticate
router.use(authenticate)

//logout
router.post("/logout", asyncHandler(accessController.logout))

module.exports = router
