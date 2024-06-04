"use strict"

const userModel = require("../user.model")

class UserRepository {
    findUserByUsername = async ({
        username,
        select = { username: 1, password: 1, roles: 1 },
    }) => {
        return await userModel.findOne({ username }).select(select).lean()
    }
    findUserById = async ({
        userId,
        select = { username: 1, password: 1, roles: 1 },
    }) => {
        return await userModel.findOne({ _id: userId }).select(select).lean()
    }

    createUser = async ({ username, passwordHashed }) => {
        return await userModel.create({ username, password: passwordHashed })
    }
}

module.exports = UserRepository
