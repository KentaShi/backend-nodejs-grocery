"use strict"
const bcrypt = require("bcrypt")

const { getInfoData } = require("../utils")
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("./jwt.service")
const {
    findUserByUsername,
    createUser,
    findUserById,
} = require("../models/repositories/user.repo")
const client = require("../db/redis.init")

class AccessService {
    static login = async ({ username, password }) => {
        try {
            const foundUser = await findUserByUsername({ username })
            if (!foundUser) {
                return {
                    code: 404,
                    message: "Invalid username",
                }
            }

            const match = await bcrypt.compare(password, foundUser.password)
            if (!match) {
                return {
                    code: 401,
                    message: "Wrong password",
                }
            }
            const accessToken = await signAccessToken(foundUser._id)
            const refreshToken = await signRefreshToken(foundUser._id)

            return {
                code: 200,
                user: getInfoData({
                    fields: ["username", "roles"],
                    object: foundUser,
                }),
                tokens: {
                    accessToken,
                    refreshToken,
                },
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }

    static logout = async ({ userId }) => {
        try {
            console.log(userId)
            client.del(userId.toString(), (err, reply) => {})
            return {
                code: 200,
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }

    static getAuth = async ({ refreshToken }) => {
        try {
            const { userId } = await verifyRefreshToken(refreshToken)
            console.log(userId)
            const accessToken = await signAccessToken(userId)
            const foundUser = await findUserById({ userId })
            if (!foundUser) {
                return {
                    code: 404,
                    message: "User not found",
                }
            }
            return {
                code: 200,
                user: getInfoData({
                    fields: ["username", "roles"],
                    object: foundUser,
                }),
                tokens: {
                    accessToken,
                },
            }
        } catch (error) {
            console.log(error.message)
            if (error.message === "jwt expired") {
                return {
                    code: 401,
                    message: "Please login",
                }
            }
            return {
                code: 500,
                message: error.message,
            }
        }
    }

    static refreshToken = async ({ refreshToken }) => {
        const { userId } = await verifyRefreshToken(refreshToken)
        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)
        return { code: 200, accessToken, refreshToken: refToken }
    }

    static register = async ({ username, password, confirmPassword }) => {
        try {
            if (password !== confirmPassword) {
                return {
                    code: 400,
                    message: "Passwords do not match",
                }
            }
            const foundUser = await findUserByUsername({ username })
            if (foundUser) {
                return {
                    code: 409,
                    message: "This username already exists",
                }
            }
            const passwordHashed = await bcrypt.hash(password, 10)
            const newUser = await createUser({ username, passwordHashed })
            if (newUser) {
                return {
                    code: 201,
                    user: getInfoData({
                        fields: ["username", "roles"],
                        object: newUser,
                    }),
                }
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }
}

module.exports = AccessService
