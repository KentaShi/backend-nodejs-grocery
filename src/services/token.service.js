"use strict"

const TokenRepository = require("../models/repositories/token.repo")

class TokenService {
    static create = async ({ userId, refreshToken }) => {
        try {
            const userToken = await TokenRepository.create({
                userId,
                refreshToken,
            })
            return userToken
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = TokenService
