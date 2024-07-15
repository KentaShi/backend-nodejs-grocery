"use strict"
const { NotFoundError } = require("../core/errors/app.error")
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
            return userStatus
        } catch (error) {
            throw error
        }
    }
    getStatus = async (userId) => {
        try {
            const thresholde = 5 * 60 * 1000
            const userStatus = await this.#userStatusRepository.findByUserId(
                userId
            )
            if (!userStatus)
                throw new NotFoundError(`Not found userStatus for ${userId}`)

            if (userStatus.isBlocked) {
                return { status: "blocked" }
            }

            const isOnline =
                new Date() - new Date(userStatus.lastSeen) < thresholde
            return isOnline ? { status: "online" } : { status: "offline" }
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
