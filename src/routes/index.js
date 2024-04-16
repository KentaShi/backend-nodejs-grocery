const router = require("express").Router()

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

router.use("/api/access", require("./access"))
router.use("/api/product", require("./product"))

module.exports = router
