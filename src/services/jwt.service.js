"use strict"
const JWT = require("jsonwebtoken")
const { UnauthorizedError } = require("../core/errors/app.error")

class JWTService {
    constructor() {
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
        this.accessTokenExpiryTime = "1d"
        this.refreshTokenExpiryTime = "30d"
    }
    signAccessToken = async (payload) => {
        return new Promise((resolve, reject) => {
            const secret = this.accessTokenSecret
            const options = {
                expiresIn: this.accessTokenExpiryTime,
            }

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) reject(err)
                resolve(token)
            })
        })
    }

    signRefreshToken = async (payload) => {
        return new Promise((resolve, reject) => {
            const secret = this.refreshTokenSecret
            const options = {
                expiresIn: this.refreshTokenExpiryTime,
            }
            JWT.sign(payload, secret, options, async (err, token) => {
                if (err) reject(err)
                resolve(token)
            })
        })
    }
    verifyAccessToken = async (accessToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                accessToken,
                this.accessTokenSecret,
                async (err, payload) => {
                    if (err) {
                        if (err.message === "jwt expired") {
                            return reject(new UnauthorizedError(err.message))
                        }
                        return reject(err)
                    }
                    resolve(payload)
                }
            )
        })
    }

    verifyRefreshToken = async (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                refreshToken,
                this.refreshTokenSecret,
                async (err, payload) => {
                    if (err) return reject(err)
                    resolve(payload)
                }
            )
        })
    }
}

module.exports = JWTService
