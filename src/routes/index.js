const router = require("express").Router()
let io
//test api
router.get("/api/test-api", (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "Api OK",
        metadata: [
            {
                name: "Kentanam",
                age: 18,
            },
        ],
    })
})

function initIO(socketIo) {
    io = socketIo
    console.log(io)
}

router.use("/api/access", require("./access"))
router.use("/api/user", require("./user"))
router.use("/api/category", require("./category"))
router.use("/api/product", require("./product"))
router.use("/api/upload", require("./upload"))

module.exports = { router, initIO }
