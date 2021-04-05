if (process.env.NODE_ENV !== 'production') require('dotenv').config({path:'./.env'})

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

// routers
app.use('/', require('./routes/editor'))

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})