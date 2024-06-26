class SocketService {
    connection = (socket) => {
        console.log(`A user connected with id ${socket.id}`)
        socket.on("disconnect", () => {
            console.log(`User disconnected with id ${socket.id}`)
        })
    }
}

module.exports = new SocketService()
