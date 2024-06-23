"use strict"

const userModel = require("../user.model")

class UserRepository {
    findByUsername = async ({
        username,
        select = { username: 1, password: 1, roles: 1 },
    }) => {
        return await userModel.findOne({ username }).select(select).lean()
    }
    findById = async ({ userId, select = { username: 1, roles: 1 } }) => {
        return await userModel.findOne({ _id: userId }).select(select).lean()
    }
    findAll = async () => await userModel.find().lean()

    create = async ({ username, passwordHashed }) => {
        return await userModel.create({ username, password: passwordHashed })
    }
}

module.exports = UserRepository
