if (process.env.NODE_ENV !== 'production') require('dotenv').config({path:'./.env'})

const knex = require('./db/knex.js')

const fs = require('fs')
let themes = [];
fs.readdir('./public/themes/', (err, files) => {
    files.forEach(file => {
        let name = file.substr(0, file.length-5)
        if (name !== 'default')
            themes.push(name)
    });
});

const express = require('express')
const app = express()
app.use(express.static(__dirname))

const nunjucks = require('nunjucks')
nunjucks.configure('views', { noCache: true })
app.engine('html', nunjucks.render)
app.set('view engine', 'html')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const uuid = require('short-uuid')
app.use((req, res, next) => {
    req.id = uuid.generate()
    next()
})

// routers
// app.use('/api', require('./routes/api'))

const port = process.env.PORT || 5000
const wakeDyno = require('./util/wakeDyno')
app.listen(port, () => {
    console.log(`port: ${port}`)
    wakeDyno(process.env.HEROKU_DYNO, 28)
})

app.get('/wake', (req, res) => {
    res.status(200).send({message:'woke O_O'})
})


const pandoc = require('node-pandoc')

function getPath(id) {
    return `./temp/slides${id}.pptx`
}

app.get('/', (req, res) => {
    res.render('index.html', {
        themes: themes
    })
})

app.post('/', (req, res) => {

    let path = getPath(req.id)
    let src = req.body.text.replace(/(\r\n|\n|\r)/gm, '\r\n\r\n')
    let theme = req.body.theme
    let args = `-s --from markdown --to pptx --reference-doc ./public/themes/${theme}.pptx -o ${path}`

    pandoc(src, args, (error, result) => {
        if (error) return console.error(error)
        else {

            res.download(path, 'texttoslides.pptx', (err) => {
                if (!err) {
                    fs.unlink(path, (err) => {
                        if (error) return console.error(error)
                    });
                }
            });

        }
    })
})