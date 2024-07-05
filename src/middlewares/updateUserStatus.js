"use strict"

const { BadRequestError } = require("../core/errors/app.error")
const asyncHandler = require("../helpers/asyncHandler")

const updateUserStatus = asyncHandler(async (req, res, next) => {
    if (req.user) {
        next()
    } else {
        next(new BadRequestError("Invalid user"))
    }
})

module.exports = { updateUserStatus }
