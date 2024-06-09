const { validationResult } = require("express-validator")
const { BadRequestError } = require("../errors/app.error")

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        next(new BadRequestError(errors.array()[0].msg))
        //return res.status(400).json({ errors: errors.array() })
    }
    next()
}

module.exports = { validate }
