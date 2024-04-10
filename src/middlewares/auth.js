"use strict"

const asyncHandler = require("../helpers/asyncHandler")
const { UnauthorizedResponse } = require("../response/error.response")
const JWT = require("jsonwebtoken")
const { verifyRefreshToken } = require("../services/jwt.service")
const HEADER = require("../constants/header.constant")

const verifyAccessToken = async (req, res, next) => {
    if (!req.headers["authorization"]) {
        return new UnauthorizedResponse({ message: "Unauthorized" }).send(res)
    }
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.message === "jwt expired") {
                return new UnauthorizedResponse({
                    message: err.message,
                }).send(res)
            }
            return new UnauthorizedResponse({
                message: `Unauthorized, ${err.message}`,
            }).send(res)
        }
        req.payload = payload
        next()
    })
}

const authenticate = asyncHandler(async (req, res, next) => {
    if (!req.headers[HEADER.AUTHORIZATION]) {
        return new UnauthorizedResponse({
            message: "Invalid access token",
        }).send(res)
    }
    if (!req.headers[HEADER.REFRESHTOKEN]) {
        return new UnauthorizedResponse({
            message: "Invalid refresh token!",
        }).send(res)
    }
    const rtoken = req.headers[HEADER.REFRESHTOKEN]
    await verifyRefreshToken(rtoken)

    const authHeader = req.headers[HEADER.AUTHORIZATION]
    const accessToken = authHeader.split(" ")[1]
    JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return new UnauthorizedResponse({
                message: `Unauthorized, ${err.message}`,
            }).send(res)
        }
        req.payload = payload
        req.refreshToken = rtoken
        next()
    })
})

module.exports = { verifyAccessToken, authenticate }
