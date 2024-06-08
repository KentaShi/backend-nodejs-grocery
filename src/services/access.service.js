"use strict"
const bcrypt = require("bcrypt")

const { getInfoData } = require("../utils")
const JWTService = require("./jwt.service")
const UserRepository = require("../models/repositories/user.repo")
const client = require("../db/redis.init")
const tokenService = require("./token.service")

class AccessService {
    constructor() {
        this.userRepository = new UserRepository()
    }
    login = async ({ username, password }) => {
        try {
            const foundUser = await this.userRepository.findUserByUsername({
                username,
            })
            if (!foundUser) {
                return {
                    code: 400,
                    message: "Username hoặc mật khẩu không đúng",
                }
            }

            const match = await bcrypt.compare(password, foundUser.password)
            if (!match) {
                return {
                    code: 400,
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

    logout = async ({ userId }) => {
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

    getAuth = async ({ refreshToken }) => {
        try {
            const { userId } = await JWTService.verifyRefreshToken(refreshToken)

            const accessToken = await JWTService.signAccessToken(userId)
            const foundUser = await this.userRepository.findUserById({ userId })
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
                    message: "Vui lòng đăng nhập",
                }
            }
            return {
                code: 500,
                message: error.message,
            }
        }
    }

    refreshToken = async ({ refreshToken }) => {
        const { userId } = await JWTService.verifyRefreshToken(refreshToken)
        const accessToken = await JWTService.signAccessToken(userId)
        const refToken = await JWTService.signRefreshToken(userId)
        return { code: 200, accessToken, refreshToken: refToken }
    }

    register = async ({ username, password, confirmPassword }) => {
        try {
            if (password !== confirmPassword) {
                return {
                    code: 400,
                    message: "Mật khẩu không khớp",
                }
            }
            const foundUser = await this.userRepository.findUserByUsername({
                username,
            })
            if (foundUser) {
                return {
                    code: 409,
                    message: "Username đã tồn tại",
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
            throw new Error(error.message)
        }
    }
}

module.exports = AccessService
