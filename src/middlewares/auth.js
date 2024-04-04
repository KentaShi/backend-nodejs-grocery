"use strict"

const { AuthFailureError } = require("../response/error.response")
const JWT = require("jsonwebtoken")

const verifyAccessToken = async (req, res, next) => {
    if (!req.headers["authorization"]) {
        return new AuthFailureError("Unauthorized").send(res)
    }
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    console.log(token)
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.message === "jwt expired") {
                return new AuthFailureError(
                    `Unauthorized, ${err.message}`
                ).send(res)
            }
            return new AuthFailureError(`Unauthorized, ${err.message}`).send(
                res
            )
        }
        req.payload = payload
        next()
    })
}

module.exports = { verifyAccessToken }
