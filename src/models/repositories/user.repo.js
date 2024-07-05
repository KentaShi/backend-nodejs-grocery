"use strict"

const userModel = require("../user.model")

class UserRepository {
    findByUsername = async ({
        username,
        select = { avatar: 1, username: 1, password: 1, role: 1 },
    }) => {
        return await userModel.findOne({ username }).select(select).lean()
    }
    findById = async ({
        userId,
        select = { avatar: 1, username: 1, role: 1 },
    }) => {
        return await userModel.findOne({ _id: userId }).select(select).lean()
    }
    findAll = async () => await userModel.find().lean()

    create = async ({ username, passwordHashed }) => {
        return await userModel.create({ username, password: passwordHashed })
    }
}

module.exports = UserRepository
