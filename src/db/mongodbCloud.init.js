const mongoose = require("mongoose")

const connectDB = () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log("Connected to MongoDB Atlas"))
        .catch((error) =>
            console.error("Error connecting to MongoDB Atlas:", error)
        )
}
module.exports = { connectDB }
