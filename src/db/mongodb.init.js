"use strict"
const mongoose = require("mongoose")

const {
    db: { host, port, name },
} = require("../config/mongodb.config")

const connectStr = `mongodb://${host}:${port}/${name}`

const connectCount = () => {
    const numConnections = mongoose.connections.length
    return numConnections
}

class Database {
    constructor() {
        this.connect()
    }

    connect() {
        mongoose.set("debug", true)
        mongoose.set("debug", { color: true })

        mongoose
            .connect(connectStr, { maxPoolSize: 50 })
            .then((_) => {
                console.log(`Connected to Mongoose database - ${connectStr}`)
                console.log(`Connection count: ${connectCount()}`)
            })
            .catch((err) => {
                ;`Error connecting to Mongoose database: ${err}`
            })
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

module.exports = Database.getInstance()
