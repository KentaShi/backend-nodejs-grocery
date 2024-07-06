const { last } = require("lodash")
const UserStatusRepository = require("../models/repositories/userStatus.repo")

const userStatusRepository = new UserStatusRepository()
class UserStatusService {
    #userStatusRepository
    constructor() {
        this.#userStatusRepository = userStatusRepository
    }
    findByUserId = async (userId) => {
        try {
            const userStatus = await this.#userStatusRepository.findByUserId(
                userId
            )
            return { userStatus }
        } catch (error) {
            throw error
        }
    }

    updateLastSeen = async (userId) => {
        try {
            const lastSeen = new Date()
            const updateData = { lastSeen }
            await this.#userStatusRepository.findOneAndUpdate(
                userId,
                updateData
            )
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserStatusService
