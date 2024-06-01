"use strict"
const bcrypt = require("bcrypt")

const { getInfoData } = require("../utils")
const JWTService = require("./jwt.service")
const {
    findUserByUsername,
    createUser,
    findUserById,
} = require("../models/repositories/user.repo")
const client = require("../db/redis.init")
const tokenService = require("./token.service")

class AccessService {
    static login = async ({ username, password }) => {
        try {
            const foundUser = await findUserByUsername({ username })
            if (!foundUser) {
                return {
                    code: 404,
                    message: "Username hoặc mật khẩu không đúng",
                }
            }

            const match = await bcrypt.compare(password, foundUser.password)
            if (!match) {
                return {
                    code: 401,
                    message: "Username hoặc password không đúng",
                }
            }
            const accessToken = await JWTService.signAccessToken(foundUser._id)
            const refreshToken = await JWTService.signRefreshToken(
                foundUser._id
            )

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
            throw new Error(error.message)
        }
    }

    static logout = async ({ userId }) => {
        try {
            await tokenService.deleteByUserId({ userId })
            // using redis
            // client.del(userId.toString(), (err, reply) => {})
            return {
                code: 200,
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static getAuth = async ({ refreshToken }) => {
        try {
            const { userId } = await JWTService.verifyRefreshToken(refreshToken)

            const accessToken = await JWTService.signAccessToken(userId)
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
        const { userId } = await JWTService.verifyRefreshToken(refreshToken)
        const accessToken = await JWTService.signAccessToken(userId)
        const refToken = await JWTService.signRefreshToken(userId)
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
                    message: "Username đã tồn tại",
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
            throw new Error(error.message)
        }
    }
}

module.exports = AccessService
