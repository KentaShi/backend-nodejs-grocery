"use strict"
const TokenModel = require("../token.model")

class TokenRepository {
    static create = async ({ userId, refreshToken }) => {
        return await TokenModel.create({
            userId,
            refreshToken,
        })
    }
}

module.exports = TokenRepository
