"use strict"
const bcrypt = require("bcrypt")

const { getInfoData } = require("../utils")
const JWTService = require("./jwt.service")
const UserRepository = require("../models/repositories/user.repo")
const TokenService = require("./token.service")
const {
    AppError,
    BadRequestError,
    NotFoundError,
    ConflictError,
    ForbiddenError,
} = require("../core/errors/app.error")
const UserStatusService = require("./userStatus.service")

class AccessService {
    #userStatusService
    constructor() {
        this.userRepository = new UserRepository()
        this.tokenService = new TokenService()
        this.jwtService = new JWTService()
        this.#userStatusService = new UserStatusService()
    }
    #generateTokenPair = async (user) => {
        const accessToken = await this.jwtService.signAccessToken({ user })
        const refreshToken = await this.jwtService.signRefreshToken({
            user,
        })
        return { accessToken, refreshToken }
    }

    login = async ({ username, password }) => {
        try {
            const foundUser = await this.userRepository.findByUsername({
                username,
            })
            if (!foundUser) {
                throw new BadRequestError()
            }

            const match = await bcrypt.compare(password, foundUser.password)
            if (!match) {
                throw new BadRequestError()
            }

            const userStatus = await this.#userStatusService.findByUserId(
                foundUser._id
            )
            if (userStatus.isBlocked) {
                throw new ForbiddenError("You are blocked")
            }

            const user = {
                userId: foundUser._id,
                username: foundUser.username,
                role: foundUser.role,
            }

            const { accessToken, refreshToken } = await this.#generateTokenPair(
                user
            )

            const updateData = { refreshToken }
            const userToken = await this.tokenService.findOneAndUpdate({
                userId: foundUser._id,
                updateData,
            })

            if (!userToken) {
                throw new AppError("Error updating user token")
            }

            return {
                code: 200,
                user: getInfoData({
                    fields: ["_id", "avatar", "username", "role"],
                    object: foundUser,
                }),
                tokens: {
                    accessToken,
                    refreshToken,
                },
            }
        } catch (error) {
            throw error
        }
    }

    logout = async (userId) => {
        try {
            await this.tokenService.deleteByUserId(userId)
        } catch (error) {
            throw error
        }
    }

    getAuth = async (refreshToken) => {
        try {
            const payload = await this.jwtService.verifyRefreshToken(
                refreshToken
            )

            const { user } = payload

            const foundUser = await this.userRepository.findById({
                userId: user.userId,
            })
            if (!foundUser) {
                throw new NotFoundError()
            }
            // handle blocked users
            const userStatus = await this.#userStatusService.findByUserId(
                foundUser._id
            )
            if (userStatus.isBlocked) {
                throw new ForbiddenError("You are blocked")
            }

            //todo: handle login on other session
            const foundUserToken = await this.tokenService.findByUserId({
                userId: user.userId,
            })
            if (foundUserToken.refreshToken !== refreshToken) {
                throw new ForbiddenError("Token had been updated, login again")
            }
            //todo: end

            const accessToken = await this.jwtService.signAccessToken({ user })

            return {
                code: 200,
                user: getInfoData({
                    fields: ["_id", "avatar", "username", "role"],
                    object: foundUser,
                }),
                tokens: {
                    accessToken,
                },
            }
        } catch (error) {
            throw error
        }
    }

    refreshToken = async (token) => {
        try {
            const payload = await this.jwtService.verifyRefreshToken(token)
            const { user } = payload
            const { accessToken, refreshToken } = await this.#generateTokenPair(
                user
            )
            // update user's refresh token
            const updateData = { refreshToken }
            const userToken = await this.tokenService.findOneAndUpdate({
                userId: user.userId,
                updateData,
            })

            if (!userToken) {
                throw new AppError("Error updating user token")
            }

            return { code: 200, accessToken, refreshToken }
        } catch (error) {
            throw error
        }
    }

    register = async ({ username, password, confirmPassword }) => {
        try {
            if (password !== confirmPassword) throw new BadRequestError()
            const foundUser = await this.userRepository.findByUsername({
                username,
            })
            if (foundUser) {
                throw new ConflictError()
            }

            const passwordHashed = await bcrypt.hash(password, 10)
            const newUser = await this.userRepository.create({
                username,
                passwordHashed,
            })
            if (newUser) {
                return {
                    code: 201,
                    user: getInfoData({
                        fields: ["avatar", "username", "role"],
                        object: newUser,
                    }),
                }
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = AccessService
