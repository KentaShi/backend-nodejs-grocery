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
            throw error
        }
    }
    findOneAndUpdate = async ({ userId, updateData }) => {
        try {
            const userToken = await this.tokenRepository.findOneAndUpdate({
                userId,
                updateData,
            })
            return userToken
        } catch (error) {
            throw error
        }
    }
    findByUserId = async ({ userId }) => {
        try {
            const userToken = await this.tokenRepository.findByUserId({
                userId,
            })
            return userToken
        } catch (error) {
            throw error
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
            throw error
        }
    }
    deleteByUserId = async ({ userId }) => {
        try {
            await this.tokenRepository.deleteByUserId({ userId })
        } catch (error) {
            throw error
        }
    }
}
module.exports = TokenService
