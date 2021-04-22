const express = require('express')
const routes = require('./routes/routes')
const database = require('./api/DB')
const db = new database()
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(routes)

async function start() {
    try {
        await db.connect()

        app.listen(PORT, () => {
            console.log('Server has been started... Listening on port: ' + PORT)
        })
    } catch (error) {
        console.log(error)
    }
}


start()