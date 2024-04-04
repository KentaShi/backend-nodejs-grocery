"use strict"
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode")

class SuccessResponse {
    constructor({ message, status = StatusCodes.OK, metadata = {} }) {
        this.message = message ? message : ReasonPhrases.OK
        this.status = status
        this.metadata = metadata
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

module.exports = { SuccessResponse }
