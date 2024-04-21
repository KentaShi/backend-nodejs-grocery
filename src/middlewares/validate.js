const { validationResult } = require("express-validator")
const { BadRequestResponse } = require("../response/error.response")

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return new BadRequestResponse({ message: errors.array()[0].msg }).send(
            res
        )
        //return res.status(400).json({ errors: errors.array() })
    }
    next()
}
module.exports = { validate }
