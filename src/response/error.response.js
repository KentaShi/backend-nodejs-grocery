"use strict"
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode")

class ErrorResponse {
    constructor({ message, status = StatusCodes.INTERNAL_SERVER_ERROR }) {
        this.message = message ? message : ReasonPhrases.INTERNAL_SERVER_ERROR
        this.status = status
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class NotFoundResponse extends ErrorResponse {
    constructor({
        message = ReasonPhrases.NOT_FOUND,
        status = StatusCodes.NOT_FOUND,
    }) {
        super({ message, status })
    }
}

class NotModifiedResponse extends ErrorResponse {
    constructor({
        message = ReasonPhrases.NOT_MODIFIED,
        status = StatusCodes.NOT_MODIFIED,
    }) {
        super({ message, status })
    }
}

// class BadRequestError extends ErrorResponse {
//     constructor(
//         message = ReasonPhrases.BAD_REQUEST,
//         status = StatusCodes.BAD_REQUEST
//     ) {
//         super(message, status)
//     }
// }
class UnauthorizedResponse extends ErrorResponse {
    constructor({
        message = ReasonPhrases.UNAUTHORIZED,
        status = StatusCodes.UNAUTHORIZED,
    }) {
        super({ message, status })
    }
}

module.exports = {
    ErrorResponse,
    UnauthorizedResponse,
    NotFoundResponse,
    NotModifiedResponse,
}
