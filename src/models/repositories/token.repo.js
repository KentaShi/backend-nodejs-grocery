"use strict"
const TokenModel = require("../token.model")

class TokenRepository {
    create = async ({ userId, refreshToken }) => {
        return await TokenModel.create({
            userId,
            refreshToken,
        })
    }
    findByUserId = async ({ userId }) => {
        return await TokenModel.findOne({ userId }).lean()
    }
    updateByUserId = async ({ userId, refreshToken }) => {
        return await TokenModel.updateOne(
            { userId },
            {
                $set: {
                    refreshToken,
                },
            }
        )
    }
    deleteByUserId = async ({ userId }) => {
        return await TokenModel.deleteOne({ userId })
    }
}

module.exports = TokenRepository
