"use strict"

const {
    ErrorResponse,
    BadRequestError,
    NotFoundResponse,
    EResponse,
    UnauthorizedResponse,
    NotModifiedResponse,
} = require("../response/error.response")
const { SuccessResponse } = require("../response/success.response")
const AccessService = require("../services/access.service")

const login = async (req, res, next) => {
    const { code, ...results } = await AccessService.login(req.body)

    switch (code) {
        case 200:
            return new SuccessResponse({
                message: "Login successful",
                metadata: results,
            }).send(res)
        case 404:
            return new NotFoundResponse({
                message: results?.message,
            }).send(res)
        case 401:
            return new UnauthorizedResponse({ message: results?.message }).send(
                res
            )
        default:
            return new ErrorResponse({ message: "Login failed" }).send(res)
    }
}

const logout = async (req, res, next) => {
    return new SuccessResponse({
        message: "Logout successful",
        metadata: await AccessService.logout(),
    }).send(res)
}

const register = async (req, res, next) => {
    const { code, ...results } = await AccessService.register(req.body)
    switch (code) {
        case 201:
            return new SuccessResponse({
                message: "Register successful",
                metadata: results,
            }).send(res)
        case 304:
            return new NotModifiedResponse({ message: results?.message }).send(
                res
            )
        default:
            return new ErrorResponse().send(res)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.headers["x-refresh-token"]
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

module.exports = { login, register, logout, refreshToken }
