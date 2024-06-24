const { BadRequestError } = require("../core/errors/app.error")
const UserRepository = require("../models/repositories/user.repo")

class UserService {
    constructor() {
        this.userRepository = new UserRepository()
    }
    findAll = async () => {
        try {
            const users = await this.userRepository.findAll()
            return { code: 200, users }
        } catch (error) {
            throw error
        }
    }
    updateRole = async (userId, role) => {
        try {
            switch (role) {
                case "user":
                case "guest":
                default:
                    throw new BadRequestError()
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserService
