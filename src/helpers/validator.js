const { body, query } = require("express-validator")

const productValidator = [
    body("product_name", "Tên sản phẩm không được trống").notEmpty(),
    body("product_price", "Giá sản phẩm phải là số").isInt({ min: 0 }),
    body("product_cate", "Phân loại không được trống").notEmpty(),
    body("product_thumb", "Thumbnail không được trống").notEmpty(),
]

const categoryValidator = [body("cate_name", "Tên không được trống").notEmpty()]

const loginValidator = [
    body("username", "Username không được trống").notEmpty(),
    body("password", "Password không được trống").notEmpty(),
]

const registerValidator = [
    body("username", "Username không được trống").notEmpty(),
    body("password", "Password ít nhất 4 ký tự").isLength({
        min: 4,
    }),
    body("confirmPassword", "Password không khớp!").custom((value, { req }) => {
        return value === req.body.password
    }),
]

const searchValidator = [query("q", "Text search is empty!").notEmpty()]

module.exports = {
    productValidator,
    loginValidator,
    registerValidator,
    searchValidator,
    categoryValidator,
}
