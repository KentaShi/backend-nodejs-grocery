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
}

module.exports = UserService
