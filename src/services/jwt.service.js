"use strict"
const JWT = require("jsonwebtoken")
const client = require("../db/redis.init")
const {
    AuthFailureError,
    UnauthorizedResponse,
} = require("../response/error.response")

const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId }
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {
            expiresIn: "1m",
        }

        JWT.sign(payload, secret, options, (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId }
        const secret = process.env.REFRESH_TOKEN_SECRET
        const options = {
            expiresIn: "1d",
        }

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            client.set(
                userId.toString(),
                token,
                "EX",
                365 * 24 * 60 * 60,
                (err, reply) => {
                    if (err) reject(err)
                    resolve(token)
                }
            )
        })
    })
}

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, payload) => {
                if (err) return reject(err)
                client.get(payload.userId, (err, reply) => {
                    if (err) return reject(err)
                    if (refreshToken === reply) resolve(payload)
                    return reject(
                        new UnauthorizedResponse({
                            message: "Invalid refresh token",
                        })
                    )
                })
            }
        )
    })
}

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken }
