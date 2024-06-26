const { body, query } = require("express-validator")
const path = require("node:path")

const createProductValidator = [
    body("product_name", "product_name does not empty").notEmpty(),
    body("product_price", "product_price must be a valid number").isInt({
        min: 0,
    }),
    body("product_cate", "product_cate does not empty").notEmpty(),
    body("file", "Invalid product image").custom((value, { req }) => {
        const extension = path.extname(req.file.path).toLowerCase()
        switch (extension) {
            case ".jpg":
                return ".jpg"
            case ".jpeg":
                return ".jpeg"
            case ".png":
                return ".png"
            default:
                return false
        }
    }),
]

const updateProductValidator = [
    body("product_name", "product_name does not empty").notEmpty(),
    body("product_price", "product_price must be a valid number").isInt({
        min: 0,
    }),
    body("product_cate", "product_cate does not empty").notEmpty(),
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
    updateProductValidator,
    createProductValidator,
    loginValidator,
    registerValidator,
    searchValidator,
    categoryValidator,
}
