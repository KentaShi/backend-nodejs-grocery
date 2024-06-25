const app = require("./src/app")
const http = require("http")
const socketIo = require("socket.io")
require("dotenv").config()

const PORT = process.env.PORT || 3030

const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST", "PUT"], // Allow these HTTP methods
        allowedHeaders: ["my-custom-header"], // Allow these headers
        credentials: true, // Enable credentials (cookies, authorization headers, TLS client certificates)
    },
})

const appRoutes = require("./src/routes")
appRoutes.initIO(io)

io.on("connection", (socket) => {
    console.log("New client connected")

    socket.on("disconnect", () => {
        console.log("Client disconnected")
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})

module.exports = { io }
