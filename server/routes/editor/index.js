const express = require('express')
const router = express.Router()
const read = require('node-readability')
const h2m = require('h2m');
const Notion = require('node-notion')
const notion = new Notion()

router.get('/*', (req, res) => {
    res.status(200).send("OK")
})

router.post('/grab', async (req, res) => {
    let link = req.body.link
    let url = new URL(req.body.link)
    let text = ''
    if (url.hostname === "www.notion.so") {
        text = await extractFromNotion(link)

        res.json({ html: text })
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

            res.json({ html: text })
        });
    }
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

