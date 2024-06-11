"use strict"

const sendErrorDev = (err, req, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
        stack: err.stack,
        error: err,
    })
}

const sendErrorProd = (err, req, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        console.error("ERROR 💥", err)
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        })
    }
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || "error"
    error.message = error.message || "Internal Server Error"

    if (process.env.NODE_ENV === "dev") {
        sendErrorDev(error, req, res)
    } else if (process.env.NODE_ENV === "prod") {
        sendErrorProd(error, req, res)
    }
}
