"use strict"

const dev = {
    db: {
        host: process.env.DEV_DB_HOST || "localhost",
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "groceryDev",
    },
}

const product = {
    db: {
        host: process.env.PRODUCT_DB_HOST || "localhost",
        port: process.env.PRODUCT_DB_PORT || 27017,
        name: process.env.PRODUCT_DB_NAME || "groceryProduct",
    },
}

const config = { dev, product }

const ENV = process.env.NODE_ENV || "dev"

module.exports = config[ENV]
