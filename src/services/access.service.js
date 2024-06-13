"use strict"
const bcrypt = require("bcrypt")

const { getInfoData } = require("../utils")
const JWTService = require("./jwt.service")
const UserRepository = require("../models/repositories/user.repo")
const client = require("../db/redis.init")
const tokenService = require("./token.service")
const { AppError, UnauthorizedError } = require("../errors/app.error")

class AccessService {
    constructor() {
        this.userRepository = new UserRepository()
    }
    login = async ({ username, password }) => {
        try {
            const select = { username: 1, password: 1, roles: 1 }
            const foundUser = await this.userRepository.findUserByUsername({
                username,
                select,
            })
            if (!foundUser) {
                return {
                    code: 400,
                }
            }

            const match = await bcrypt.compare(password, foundUser.password)
            if (!match) {
                return {
                    code: 400,
                }
            }
            const accessToken = await JWTService.signAccessToken(foundUser)
            const refreshToken = await JWTService.signRefreshToken(foundUser)

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
            return { error }
        }
    }

    logout = async ({ userId }) => {
        try {
            await tokenService.deleteByUserId({ userId })
            // using redis
            // client.del(userId.toString(), (err, reply) => {})
            return {
                code: 200,
            }
        } catch (error) {
            return { error }
        }
    }

    getAuth = async ({ refreshToken }) => {
        try {
            const { userId } = await JWTService.verifyRefreshToken(refreshToken)

            const accessToken = await JWTService.signAccessToken(userId)
            const foundUser = await this.userRepository.findUserById({ userId })
            if (!foundUser) {
                return {
                    code: 404,
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
            return { error }
            // if (error.message === "jwt expired") {
            //     throw new UnauthorizedError(error.message)
            // }
            // throw new AppError(error.message)
        }
    }

    refreshToken = async ({ refreshToken }) => {
        try {
            const { userId } = await JWTService.verifyRefreshToken(refreshToken)
            const accessToken = await JWTService.signAccessToken(userId)
            const refToken = await JWTService.signRefreshToken(userId)
            return { code: 200, accessToken, refreshToken: refToken }
        } catch (error) {
            return { error }
        }
    }

    register = async ({ username, password, confirmPassword }) => {
        try {
            if (password !== confirmPassword) {
                return {
                    code: 400,
                }
            }
            const foundUser = await this.userRepository.findUserByUsername({
                username,
            })
            if (foundUser) {
                return {
                    code: 409,
                }
            }
            const passwordHashed = await bcrypt.hash(password, 10)
            const newUser = await this.userRepository.createUser({
                username,
                passwordHashed,
            })
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
            return { error }
        }
    }
}

module.exports = AccessService
