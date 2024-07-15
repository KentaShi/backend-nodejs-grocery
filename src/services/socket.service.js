const UserStatusService = require("./userStatus.service")

class SocketService {
    #userStatusService
    constructor() {
        this.#userStatusService = new UserStatusService()
    }
    connection = (socket) => {
        console.log(`A user connected with id ${socket.id}`)
        console.log("Number of connected clients:", _io.engine.clientsCount)

        socket.on("identify", async (userId) => {
            socket.userId = userId
            await this.#userStatusService.updateLastSeen(userId)
        })

        socket.on("disconnect", async () => {
            console.log(`User disconnected with id ${socket.id}`)
            console.log("Number of connected clients:", _io.engine.clientsCount)
            if (socket.userId) {
                await this.#userStatusService.updateLastSeen(socket.userId)
            }
        })
    }
}

module.exports = new SocketService()
