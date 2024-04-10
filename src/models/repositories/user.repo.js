"use strict"

const USER = require("../user.model")

const findUserByUsername = async ({
    username,
    select = { username: 1, password: 1, roles: 1 },
}) => {
    return await USER.findOne({ username }).select(select).lean()
}
const findUserById = async ({
    userId,
    select = { username: 1, password: 1, roles: 1 },
}) => {
    return await USER.findOne({ _id: userId }).select(select).lean()
}

const createUser = async ({ username, passwordHashed }) => {
    return await USER.create({ username, password: passwordHashed })
}

module.exports = { findUserByUsername, createUser, findUserById }
