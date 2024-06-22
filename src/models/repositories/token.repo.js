"use strict"
const TokenModel = require("../token.model")

class TokenRepository {
    create = async ({ userId, refreshToken }) => {
        return await TokenModel.create({
            userId,
            refreshToken,
        })
    }
    findOneAndUpdate = async ({ userId, updateData }) => {
        return await TokenModel.findOneAndUpdate({ userId }, updateData, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
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
    deleteByUserId = async (userId) => {
        return await TokenModel.deleteOne({ userId })
    }
}

module.exports = TokenRepository
