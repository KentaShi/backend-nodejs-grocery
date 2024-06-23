const { SuccessResponse } = require("../core/success/success.response")
const UserService = require("../services/user.service")

class UserController {
    constructor() {
        this.userService = new UserService()
    }
    findAll = async (req, res, next) => {
        try {
            const { code, ...results } = await this.userService.findAll()
            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController
