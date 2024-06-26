const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const http = require("http")
const socketIo = require("socket.io")
const app = express()

const errorHandler = require("./middlewares/errorHandler")
const { NotFoundError } = require("./core/errors/app.error")
const socketService = require("./services/socket.service")

require("dotenv").config()

//init socket.io
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST", "PUT"], // Allow these HTTP methods
        allowedHeaders: ["my-custom-header"], // Allow these headers
        credentials: true, // Enable credentials (cookies, authorization headers, TLS client certificates)
    },
})

global._io = io

global._io.on("connection", socketService.connection)

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

connectDB()

//init redis
//require("./db/redis.init")

//init routes
app.use("", require("./routes"))

// error handlers
// handle 404 errors
app.all("*", (req, res, next) => {
    next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`))
})

// Global error handling middleware
app.use(errorHandler)

module.exports = { server }
