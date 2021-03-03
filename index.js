if (process.env.NODE_ENV !== 'production') require('dotenv').config({path:'./.env'})

// this is unused but here because will need db in future for accounts
const knex = require('./db/knex.js')

const express = require('express')
const app = express()
app.use(express.static(__dirname))

const nunjucks = require('nunjucks')
nunjucks.configure('views', { noCache: true })
app.engine('njk', nunjucks.render)
app.set('view engine', 'njk')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))

const uuid = require('short-uuid')
app.use((req, res, next) => {
    req.id = uuid.generate()
    next()
})

// routers
app.use('/', require('./routes/editor'))

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`port: ${port}`)

    // this is here because currently hosting on free heroku dyno which sleeps if inactive
    const wakeDyno = require('./util/wakeDyno')
    wakeDyno(process.env.HEROKU_DYNO, 28)
})

app.get('/wake', (req, res) => {
    res.status(200).send('woke')
})

