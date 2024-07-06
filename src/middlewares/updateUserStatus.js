"use strict"

const { BadRequestError } = require("../core/errors/app.error")
const asyncHandler = require("../helpers/asyncHandler")
const UserStatusService = require("../services/userStatus.service")
const userStatusService = new UserStatusService()

const updateUserStatus = asyncHandler(async (req, res, next) => {
    try {
        if (req.user) {
            await userStatusService.updateLastSeen(req.user.userId)
        } else {
            next(new BadRequestError("Invalid user"))
        }
        next()
    } catch (error) {
        next(error)
    }
})

module.exports = { updateUserStatus }
