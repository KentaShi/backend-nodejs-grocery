"use strict"

const { SuccessResponse } = require("../core/success/success.response")
const UserStatusService = require("../services/userStatus.service")

class UserStatusController {
    #userStatusService
    constructor() {
        this.#userStatusService = new UserStatusService()
    }
    getStatus = async (req, res, next) => {
        try {
            const { userId } = req.params
            const status = await this.#userStatusService.getStatus(userId)
            return new SuccessResponse({ metadata: status }).send(res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserStatusController
