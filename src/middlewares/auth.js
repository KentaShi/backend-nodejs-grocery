"use strict"

const asyncHandler = require("../helpers/asyncHandler")
const { UnauthorizedResponse } = require("../response/error.response")
const JWT = require("jsonwebtoken")
const { verifyRefreshToken } = require("../services/jwt.service")

const HEADER = {
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-refresh-token",
}

const verifyAccessToken = async (req, res, next) => {
    if (!req.headers["authorization"]) {
        return new UnauthorizedResponse("Unauthorized").send(res)
    }
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.message === "jwt expired") {
                return new AuthFailureError(
                    `Unauthorized, ${err.message}`
                ).send(res)
            }
            return new UnauthorizedResponse(
                `Unauthorized, ${err.message}`
            ).send(res)
        }
        req.payload = payload
        next()
    })
}

const authenticate = asyncHandler(async (req, res, next) => {
    if (!req.headers[HEADER.AUTHORIZATION]) {
        return new UnauthorizedResponse("Invalid access token").send(res)
    }
    if (!req.headers[HEADER.REFRESHTOKEN]) {
        return new UnauthorizedResponse("Invalid refresh token").send(res)
    }
    const rtoken = req.headers[HEADER.REFRESHTOKEN]
    const { userId } = await verifyRefreshToken(rtoken)
    if (!userId) {
        return new UnauthorizedResponse("Invalid refresh token").send(res)
    }

    const authHeader = req.headers[HEADER.AUTHORIZATION]
    const accessToken = authHeader.split(" ")[1]
    JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return new UnauthorizedResponse(
                `Unauthorized, ${err.message}`
            ).send(res)
        }
        req.payload = payload
        req.refreshToken = rtoken
        next()
    })
})

module.exports = { verifyAccessToken, authenticate }
