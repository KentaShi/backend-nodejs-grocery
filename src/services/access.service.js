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
} = require("../models/repositories/user.repo")

class AccessService {
    static login = async ({ username, password }) => {
        try {
            const foundUser = await findUserByUsername({ username })
            if (!foundUser) {
                return {
                    code: 404,
                    message: "Username not found",
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
                accessToken,
                refreshToken,
            }
        } catch (error) {
            return {
                code: 500,
                message: error.message,
            }
        }
    }

    static logout = async () => {
        return {
            code: 200,
        }
    }

    static refreshToken = async ({ refreshToken }) => {
        const { userId } = await verifyRefreshToken(refreshToken)
        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)
        return { code: 200, accessToken, refreshToken: refToken }
    }

    static register = async ({ username, password }) => {
        try {
            const foundUser = await findUserByUsername({ username })
            if (foundUser) {
                return {
                    code: 304,
                    message: "User already registered",
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
