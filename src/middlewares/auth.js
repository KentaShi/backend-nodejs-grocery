"use strict"

const asyncHandler = require("../helpers/asyncHandler")

const JWT = require("jsonwebtoken")
const JWTService = require("../services/jwt.service")
const TokenService = require("../services/token.service")
const HEADER = require("../constants/header.constant")
const {
    BadRequestError,
    UnauthorizedError,
} = require("../core/errors/app.error")

const jwtService = new JWTService()
const tokenService = new TokenService()

const authenticate = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers[HEADER.AUTHORIZATION]

        if (!authHeader) {
            throw new BadRequestError("Invalid access token")
        }

        const rtoken = req.headers[HEADER.REFRESHTOKEN]
        if (!rtoken) {
            throw new BadRequestError("Invalid refresh token")
        }

        const accessToken = authHeader.split(" ")[1]

        const payload = await jwtService.verifyRefreshToken(rtoken)
        const { user } = payload
        const foundToken = await tokenService.findByUserId({
            userId: user.userId,
        })

        if (rtoken === foundToken.refreshToken) {
            const decoded = await jwtService.verifyAccessToken(accessToken)
            req.user = decoded.user
            req.refreshToken = rtoken
            next()
        } else {
            throw new BadRequestError("Invalid refresh token...")
        }
    } catch (error) {
        next(error)
    }
})

module.exports = { authenticate }
