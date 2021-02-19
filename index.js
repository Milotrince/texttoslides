if (process.env.NODE_ENV !== 'production') require('dotenv').config({path:'./.env'})

const knex = require('./db/knex.js')


const express = require('express')
const app = express()
app.use(express.static(__dirname))

const nunjucks = require('nunjucks')
nunjucks.configure('views', { noCache: true })
app.engine('html', nunjucks.render)
app.set('view engine', 'html')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))

const uuid = require('short-uuid')
app.use((req, res, next) => {
    req.id = uuid.generate()
    next()
})

// routers
app.use('/', require('./routes/main'))

const port = process.env.PORT || 5000
const wakeDyno = require('./util/wakeDyno')
app.listen(port, () => {
    console.log(`port: ${port}`)
    wakeDyno(process.env.HEROKU_DYNO, 28)
})

app.get('/wake', (req, res) => {
    res.status(200).send({message:'woke O_O'})
})

