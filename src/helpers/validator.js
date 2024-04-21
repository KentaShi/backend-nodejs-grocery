const { body } = require("express-validator")

const productValidator = [
    body("product_name", "Product Name does not empty").notEmpty(),
    body("product_price", "Product Price must be a number").isInt({ min: 0 }),
    body("product_cate", "Product Category does not empty").notEmpty(),
    body("product_thumb", "Product Thumb does not empty").notEmpty(),
]

const loginValidator = [
    body("username", "Username does not empty").notEmpty(),
    body("password", "Password does not empty").notEmpty(),
]

const registerValidator = [
    body("username", "Username is required").notEmpty(),
    body("password", "Password must be at least 4 characters").isLength({
        min: 4,
    }),
    body("confirmPassword", "Passwords do not match!").custom(
        (value, { req }) => {
            return value === req.body.password
        }
    ),
]

module.exports = { productValidator, loginValidator, registerValidator }
