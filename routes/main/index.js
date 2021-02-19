const express = require('express')
const router = express.Router()
const pandoc = require('node-pandoc')
const h2m = require('h2m');
const fs = require('fs')

let themes = [];

router.get('/', (req, res) => {
    if (!themes) loadThemes()
    res.render('index.html', {
        themes: themes
    })
})

router.post('/', (req, res) => {

    let path = getPath(req.id)
    let src = h2m(req.body.text).trim()
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

function getPath(id) {
    return `./temp/slides${id}.pptx`
}

function loadThemes() {
    themes = []
    fs.readdir('./public/themes/', (err, files) => {
        files.forEach(file => {
            let name = file.substr(0, file.length-5)
            if (name !== 'default')
                themes.push(name)
        });
    });
}

module.exports = router

