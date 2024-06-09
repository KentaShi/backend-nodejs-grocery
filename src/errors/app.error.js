"use strict"
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode")

class AppError extends Error {
    constructor(
        message = ReasonPhrases.INTERNAL_SERVER_ERROR,
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
        this.isOperational = true

        Error.captureStackTrace(this, this.contructor)
    }
}
class NotFoundError extends AppError {
    constructor(
        message = ReasonPhrases.NOT_FOUND,
        statusCode = StatusCodes.NOT_FOUND
    ) {
        super(message, statusCode)
    }
}

class NotModifiedError extends AppError {
    constructor(
        message = ReasonPhrases.NOT_MODIFIED,
        statusCode = StatusCodes.NOT_MODIFIED
    ) {
        super(message, statusCode)
    }
}
class ConflictError extends AppError {
    constructor(
        message = ReasonPhrases.CONFLICT,
        statusCode = StatusCodes.CONFLICT
    ) {
        super(message, statusCode)
    }
}

class BadRequestError extends AppError {
    constructor(
        message = ReasonPhrases.BAD_REQUEST,
        statusCode = StatusCodes.BAD_REQUEST
    ) {
        super(message, statusCode)
    }
}
class UnauthorizedError extends AppError {
    constructor(
        message = ReasonPhrases.UNAUTHORIZED,
        statusCode = StatusCodes.UNAUTHORIZED
    ) {
        super(message, statusCode)
    }
}

module.exports = {
    AppError,
    ConflictError,
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    NotModifiedError,
}
