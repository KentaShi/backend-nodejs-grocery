"use strict"

const HEADER = require("../constants/header.constant")
const {
    BadRequestError,
    AppError,
    NotFoundError,
    ConflictError,
    UnauthorizedError,
} = require("../errors/app.error")
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

class AccessController {
    constructor() {
        this.accessservice = new AccessService()
    }
    login = async (req, res, next) => {
        try {
            const { code, error, ...results } = await this.accessservice.login(
                req.body
            )

            if (error) {
                return next(error)
            }

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
                        message: "success",
                        metadata: results,
                    }).send(res)
                case 400:
                    return next(new BadRequestError())
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }
    logout = async (req, res, next) => {
        try {
            const { userId } = req.payload
            const { code, error, ...results } = await this.accessservice.logout(
                {
                    userId,
                }
            )
            if (error) {
                return next(error)
            }
            switch (code) {
                case 200:
                    res.clearCookie("access_token")
                    res.clearCookie("refresh_token")
                    return new SuccessResponse({
                        message: "Logout successful",
                        metadata: results,
                    }).send(res)
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }

    register = async (req, res, next) => {
        try {
            const { code, error, ...results } =
                await this.accessservice.register(req.body)
            if (error) return next(error)
            switch (code) {
                case 201:
                    return new SuccessResponse({
                        message: "success",
                        metadata: results,
                    }).send(res)
                case 409:
                    throw new ConflictError()
                case 400:
                    return next(new BadRequestError())
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }

    getAuth = async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                return next(new NotFoundError("No refresh token"))
            }
            const { code, error, ...results } =
                await this.accessservice.getAuth({
                    refreshToken,
                })
            if (error) {
                if (error.message === "jwt expired")
                    return next(new UnauthorizedError())
                return next(error)
            }
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        metadata: results,
                    }).send(res)
                case 404:
                    return next(new NotFoundError())
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }

    refreshToken = async (req, res, next) => {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            if (!refreshToken) {
                return next(new NotFoundError("No refresh token"))
            }
            const { code, error, ...results } =
                await this.accessservice.refreshToken({
                    refreshToken,
                })
            if (error) return next(error)
            switch (code) {
                case 200:
                    return new SuccessResponse({
                        metadata: results,
                    }).send(res)
                default:
                    return next(new AppError())
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = AccessController
