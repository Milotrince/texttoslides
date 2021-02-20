const express = require('express')
const router = express.Router()
const read = require('node-readability')
const pandoc = require('node-pandoc')
const h2m = require('h2m');
const fs = require('fs')
const Notion = require('node-notion')
const notion = new Notion()

let themes = []
loadThemes()

router.get('/', (req, res) => {
    res.render('index.html', {
        themes: themes
    })
})

router.get('/*', (req, res) => {
    res.redirect('/')
})

router.post('/grab', async (req, res) => {
    let link = req.body.link
    let url = new URL(req.body.link)
    let text = ''
    if (url.hostname === "www.notion.so") {
        text = await extractFromNotion(link)

        res.render('index.html', {
            themes: themes,
            data: {texthtml: text}
        })
    }
    else {
        read(link, function(err, article, meta) {
            let text = ''
            if (err) {
                text = 'Could not grab content from link :('
            } else {
                text = getTextHtml(article.title, article.content)

                article.close();
            }

            res.render('index.html', {
                themes: themes,
                data: {texthtml: text}
            })
        });
    }
})

router.post('/convert', (req, res) => {

    let path = getPath(req.id)
    let src = h2m(req.body.text).trim()
    let theme = req.body.theme
    let args = `-s --from markdown --to pptx --slide-level=2 --reference-doc ./public/themes/${theme}.pptx -o ${path}`

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

async function extractFromNotion(link) {
    let content = ''
    let page = await notion.getPage(link)
    if (page) {
        let pageData = page.getData()
        let blocks = await notion.getBlocks(pageData.value.content)
        for (block of blocks) {
            if (block) {
                let type = block.getType()

                if (typeof block.getText === 'function') {
                    let text = ''
                    try {
                        text = block.getText(markdown=true)
                    } catch (e) { }
                    if (text) {
                        switch (type) {
                            case 'header':
                                content += `\n\n# ${text}`
                                break
                            case 'sub_header':
                                content += `\n\n## ${text}`
                                break
                            case 'sub_sub_header':
                                content += `\n\n### ${text}`
                                break
                            case 'bulleted_list':
                            case 'to_do':
                                content += `\n* ${text}`
                                break
                            case 'numbered_list':
                                content += `\n1. ${text}`
                                break
                            case 'code':
                                content += `\n\`\`\`\n${text}\n\`\`\``
                                break
                            case 'quote':
                                content += `\n*"${text}"*`
                                break
                            default:
                                content += `\n${text}`
                        }
                    }

                } else if (type === 'image') {
                    let src = block.getSource()
                    if (src)
                        content += `\n<img src=${src}/>`
                }
            }
        }

        return getTextHtml(page.getTitle(), content)
    } else {
        return 'Could not load this Notion page :('
    }
}

function getPath(id) {
    return `./temp/slides${id}.pptx`
}

function loadThemes() {
    themes = []
    fs.readdir('./public/themes', (err, files) => {
        files.forEach(file => {
            let name = file.substr(0, file.length-5)
            if (name !== 'default')
                themes.push(name)
        });
    });
}

function getTextHtml(title, content) {
    let text = h2m(content).trim()
    let lines = text.split(/(?:\r\n|\r|\n)/g);
    text = `---<br/>title: ${title}<br/>---<br/><br/>`
    for (line of lines) {
        if (line === '')
            text += `<br/>`
        else 
            text += `<div>${line}</div>`
    }
    return text
}

module.exports = router

