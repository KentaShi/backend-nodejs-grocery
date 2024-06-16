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

// const verifyAccessToken = async (req, res, next) => {
//     if (!req.headers["authorization"]) {
//         next(new BadRequestError("Invalid access token"))
//     }
//     const authHeader = req.headers["authorization"]
//     const token = authHeader.split(" ")[1]
//     JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
//         if (err) {
//             if (err.message === "jwt expired") {
//                 next(new UnauthorizedError(err.message))
//             }
//             next(new BadRequestError(err.message))
//         }
//         req.payload = payload
//         next()
//     })
// }

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
            jwtService
                .verifyAccessToken(accessToken)
                .then((decoded) => {
                    req.user = decoded.user
                    req.refreshToken = rtoken
                    next()
                })
                .catch((err) => {
                    throw err
                })
        } else {
            throw new BadRequestError("Invalid refresh token...")
        }
    } catch (error) {
        next(error)
    }

    // JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    //     if (err) {
    //         if (err.message === "jwt expired") {
    //             next(new UnauthorizedError(err.message))
    //         }
    //         next(new BadRequestError(err.message))
    //     }
    //     req.payload = payload
    //     req.refreshToken = rtoken
    //     next()
    // })
})

module.exports = { authenticate }
