"use strict"

const TokenRepository = require("../models/repositories/token.repo")

class TokenService {
    constructor() {
        this.tokenRepository = new TokenRepository()
    }
    create = async ({ userId, refreshToken }) => {
        try {
            const userToken = await this.tokenRepository.create({
                userId,
                refreshToken,
            })
            return userToken
        } catch (error) {
            console.log(error)
            throw new Error("Couldn't create token")
        }
    }
    findByUserId = async ({ userId }) => {
        try {
            const userToken = await this.tokenRepository.findByUserId({
                userId,
            })
            return userToken
        } catch (error) {
            throw new Error("Couldn't find token by user id")
        }
    }
    updateByUserId = async ({ userId, refreshToken }) => {
        try {
            const userToken = await this.tokenRepository.updateByUserId({
                userId,
                refreshToken,
            })
            return userToken
        } catch (error) {
            throw new Error("Couldn't update by user id")
        }
    }
    deleteByUserId = async ({ userId }) => {
        try {
            await this.tokenRepository.deleteByUserId({ userId })
        } catch (error) {
            throw new Error("Couldn't delete by user id")
        }
    }
}
module.exports = new TokenService()
