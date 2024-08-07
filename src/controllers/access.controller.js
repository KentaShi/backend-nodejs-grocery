"use strict"

const HEADER = require("../constants/header.constant")
const { SuccessResponse } = require("../core/success/success.response")
const {
    BadRequestError,
    AppError,
    NotFoundError,
    ConflictError,
    UnauthorizedError,
} = require("../core/errors/app.error")

const AccessService = require("../services/access.service")
const UserStatusService = require("../services/userStatus.service")

class AccessController {
    #userStatusService
    constructor() {
        this.accessservice = new AccessService()
        this.#userStatusService = new UserStatusService()
    }
    login = async (req, res, next) => {
        try {
            const { code, ...results } = await this.accessservice.login(
                req.body
            )
            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
    logout = async (req, res, next) => {
        try {
            const { userId } = req.user
            await this.accessservice.logout(userId)
            await this.#userStatusService.updateLastSeen(userId)

            return new SuccessResponse({}).send(res)
        } catch (error) {
            next(error)
        }
    }

    register = async (req, res, next) => {
        try {
            const { code, ...results } = await this.accessservice.register(
                req.body
            )
            return new SuccessResponse({
                metadata: results,
            }).send(res)
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
            const { code, ...results } = await this.accessservice.getAuth(
                refreshToken
            )

            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            if (error.message === "jwt expired")
                return next(new UnauthorizedError())
            next(error)
        }
    }

    refreshToken = async (req, res, next) => {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            if (!refreshToken) {
                return next(new BadRequestError("No refresh token"))
            }
            const { code, ...results } = await this.accessservice.refreshToken(
                refreshToken
            )

            return new SuccessResponse({
                metadata: results,
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = AccessController
