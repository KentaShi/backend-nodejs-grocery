"use strict"

const userStatusModel = require("../userStatus.model")

class UserStatusRepository {
    findByUserId = async (userId) => {
        return await userStatusModel.findOne({ userId }).lean()
    }
    findOneAndUpdate = async (userId, data) => {
        await userStatusModel.findOneAndUpdate({ userId: userId }, data, {
            upsert: true,
            new: true,
        })
    }
}
module.exports = UserStatusRepository
