if (process.env.NODE_ENV !== 'production')
    require('dotenv').config({path:'./.env'})

// const knex = require('./db/knex.js') // this is unused but here because will need db in future for accounts
const express = require('express')
const bodyParser = require('body-parser')
const wakeDyno = require('./util/wakeDyno') // hosting on free heroku dyno which sleeps...
const cors = require('cors')
const corsWhitelist = process.env.CORS_WHITELIST.split(',')
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || corsWhitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}
const app = express()
const port = process.env.PORT || 5000

app.use(express.static(__dirname))
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use('/', require('./routes/editor'))

app.listen(port, () => {
    console.log(`port: ${port}`)

    wakeDyno(process.env.HEROKU_DYNO, 28)
})

app.get('/wake', (req, res) => {
    res.status(200).send('woke')
})

