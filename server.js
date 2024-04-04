const app = require("./src/app")

const PORT = process.env.PORT || 3030

const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})
