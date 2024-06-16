const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
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
    origin: "*", // Replace with your Next.js app's URL
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
const { AppError } = require("./core/errors/app.error")

connectDB()

//init redis
//require("./db/redis.init")

//init routes
app.use("", require("./routes"))

// error handlers
// handle 404 errors
app.all("*", (req, res, next) => {
    next(
        new AppError({
            message: `Can't find ${req.originalUrl} on this server!`,
            statusCode: 404,
        })
    )
})

// Global error handling middleware
app.use(errorHandler)

const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allow these HTTP methods
        allowedHeaders: ["my-custom-header"], // Allow these headers
        credentials: true, // Enable credentials (cookies, authorization headers, TLS client certificates)
    },
})

io.on("connection", (socket) => {
    socket.on("updated", (updatedProduct) => {
        io.emit("updated", updatedProduct)
    })
})

module.exports = { server, io }
