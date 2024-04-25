"use strict"

const HEADER = require("../constants/header.constant")
const {
    ErrorResponse,
    NotFoundResponse,
    UnauthorizedResponse,
    NotModifiedResponse,
    BadRequestResponse,
    ConflictResponse,
} = require("../response/error.response")
const { SuccessResponse } = require("../response/success.response")
const AccessService = require("../services/access.service")
const JWTService = require("../services/jwt.service")

const login = async (req, res, next) => {
    try {
        const { code, ...results } = await AccessService.login(req.body)

        switch (code) {
            case 200:
                // res.cookie("accessToken", results.tokens.accessToken, {
                //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                //     httpOnly: true,
                //     secure: true,
                // }).cookie("refreshToken", results.tokens.refreshToken, {
                //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                //     httpOnly: true,
                //     secure: true,
                // })
                return new SuccessResponse({
                    message: "Login successful",
                    metadata: results,
                }).send(res)
            case 404:
                return new NotFoundResponse({
                    message: results?.message,
                }).send(res)
            case 401:
                return new UnauthorizedResponse({
                    message: results?.message,
                }).send(res)
            default:
                return new ErrorResponse({ message: "Login failed" }).send(res)
        }
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        const { userId } = req.payload
        const { code, ...results } = await AccessService.logout({ userId })
        switch (code) {
            case 200:
                res.clearCookie("access_token")
                res.clearCookie("refresh_token")
                return new SuccessResponse({
                    message: "Logout successful",
                    metadata: results,
                }).send(res)
            default:
                return new ErrorResponse().send(res)
        }
    } catch (error) {
        next(error)
    }
}

const register = async (req, res, next) => {
    try {
        const { code, ...results } = await AccessService.register(req.body)
        switch (code) {
            case 201:
                return new SuccessResponse({
                    message: "Register successful",
                    metadata: results,
                }).send(res)
            case 409:
                return new ConflictResponse({
                    message: results?.message,
                }).send(res)
            case 400:
                return new BadRequestResponse({
                    message: results?.message,
                }).send(res)
            default:
                return new ErrorResponse().send(res)
        }
    } catch (error) {
        next(error)
    }
}

const getAuth = async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return new NotFoundResponse({
                message: "Refresh token not found",
            }).send(res)
        }
        const { code, ...results } = await AccessService.getAuth({
            refreshToken,
        })
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: "Welcome back",
                    metadata: results,
                }).send(res)
            case 404:
                return new NotFoundResponse({
                    message: results?.message,
                }).send(res)
            case 401:
                return new UnauthorizedResponse({
                    message: results?.message,
                }).send(res)
            default:
                return new ErrorResponse().send(res)
        }
    } catch (error) {
        next(error)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN]
        if (!refreshToken) {
            return new NotFoundResponse({
                message: "Refresh token not found",
            }).send(res)
        }
        const { code, ...results } = await AccessService.refreshToken({
            refreshToken,
        })
        switch (code) {
            case 200:
                return new SuccessResponse({
                    message: "Refresh token successful",
                    metadata: results,
                }).send(res)
            default:
                return new ErrorResponse().send(res)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { login, register, logout, refreshToken, getAuth }
