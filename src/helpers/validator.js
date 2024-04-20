const { body } = require("express-validator")

const productValidator = [
    body("product_name", "Product Name does not empty").notEmpty(),
    body("product_price", "Product Price must be a number").isInt({ min: 0 }),
    body("product_cate", "Product Category does not empty").notEmpty(),
    body("product_thumb", "Product Thumb does not empty").notEmpty(),
]

module.exports = { productValidator }
