"use strict"

const { BadRequestError, ForbiddenError } = require("../core/errors/app.error")
const asyncHandler = require("../helpers/asyncHandler")
const UserStatusService = require("../services/userStatus.service")
const userStatusService = new UserStatusService()

const updateUserStatus = asyncHandler(async (req, res, next) => {
    try {
        if (req.user) {
            const userId = req.user.userId
            const userStatus = await userStatusService.findByUserId(userId)
            if (userStatus.isBlocked) {
                throw new ForbiddenError("Blocked")
            }
            await userStatusService.updateLastSeen(userId)
        } else {
            throw new BadRequestError("Invalid user")
        }
        next()
    } catch (error) {
        next(error)
    }
})

module.exports = { updateUserStatus }
