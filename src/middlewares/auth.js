"use strict"

const asyncHandler = require("../helpers/asyncHandler")

const JWT = require("jsonwebtoken")
const { verifyRefreshToken } = require("../services/jwt.service")
const HEADER = require("../constants/header.constant")
const { BadRequestError, UnauthorizedError } = require("../errors/app.error")

const verifyAccessToken = async (req, res, next) => {
    if (!req.headers["authorization"]) {
        next(new BadRequestError("Invalid access token"))
    }
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.message === "jwt expired") {
                next(new UnauthorizedError(err.message))
            }
            next(new BadRequestError(err.message))
        }
        req.payload = payload
        next()
    })
}

const authenticate = asyncHandler(async (req, res, next) => {
    if (!req.headers[HEADER.AUTHORIZATION]) {
        next(new BadRequestError("Invalid access token"))
    }
    if (!req.headers[HEADER.REFRESHTOKEN]) {
        next(new BadRequestError("Invalid refresh token"))
    }
    const rtoken = req.headers[HEADER.REFRESHTOKEN]
    await verifyRefreshToken(rtoken)

    const authHeader = req.headers[HEADER.AUTHORIZATION]
    const accessToken = authHeader.split(" ")[1]
    JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.message === "jwt expired") {
                next(new UnauthorizedError(err.message))
            }
            next(new BadRequestError(err.message))
        }
        req.payload = payload
        req.refreshToken = rtoken
        next()
    })
})

module.exports = { verifyAccessToken, authenticate }
