const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express()

const errorHandler = require("./middlewares/errorHandler")

require("dotenv").config()

// init middleware
const corsOptions = {
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
}
app.use(cors(corsOptions))
app.use(morgan("dev"))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//init mongoose db
//require("./db/mongodb.init")

//init mongoose db cloud
const { connectDB } = require("./db/mongodbCloud.init")
const { NotFoundError } = require("./core/errors/app.error")

connectDB()

//init redis
//require("./db/redis.init")

//init routes
app.use("", require("./routes").router)

// error handlers
// handle 404 errors
app.all("*", (req, res, next) => {
    next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`))
})

// Global error handling middleware
app.use(errorHandler)

module.exports = app
