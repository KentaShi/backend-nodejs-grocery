const { body, query } = require("express-validator")

const productValidator = [
    body("product_name", "product_name does not empty").notEmpty(),
    body("product_price", "product_price must be a valid number").isInt({
        min: 0,
    }),
    body("product_cate", "product_cate does not empty").notEmpty(),
    body("product_thumb", "product_thumb does not empty").notEmpty(),
]

const categoryValidator = [
    body("cate_name", "cate_name does not empty").notEmpty(),
]

const loginValidator = [
    body("username", "Username does not empty").notEmpty(),
    body("password", "Password does not empty").notEmpty(),
]

const registerValidator = [
    body("username", "Username does not empty").notEmpty(),
    body("password", "Password at least 4 characters").isLength({
        min: 4,
    }),
    body("confirmPassword", "Password doesn't match").custom(
        (value, { req }) => {
            return value === req.body.password
        }
    ),
]

const searchValidator = [query("q", "Text search is empty!").notEmpty()]

module.exports = {
    productValidator,
    loginValidator,
    registerValidator,
    searchValidator,
    categoryValidator,
}
