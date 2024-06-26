const { server } = require("./src/app")

require("dotenv").config()

const PORT = process.env.PORT || 3030

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})
