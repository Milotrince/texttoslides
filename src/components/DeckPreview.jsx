import React from "react"
import PropTypes from "prop-types"
import CardPreview from "./CardPreview"
const MarkdownIt = require("markdown-it")
const md = new MarkdownIt()


class DeckPreview extends React.Component {

  static propTypes = {
    editorContent: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
        <div id="preview" className={this.props.className}>
          {
            this.getCardsData().map((slideData, i) => {
              return <CardPreview key={i} data={slideData} />
            })
          }
        </div>
    )
  }

  getCardsData = () => {
    let slides = []
    let slide = {}

    if (!this.props.editorContent)
      return slides


    const domParser = new DOMParser()

    const editorDom = domParser.parseFromString(this.props.editorContent, "text/html")
    let text = ""
    editorDom.body.childNodes.forEach(element => {
      let elementText = element.innerText ? element.innerText.trim() : "\n"
      text += elementText + "\n"
    })

    const mdRender = md.render(text)

    const mdDom = domParser.parseFromString(mdRender, "text/html")


    for (const element of mdDom.body.childNodes) {

      const tag = element.tagName
      const shouldStartNewSlide = () => ["HR", "H1"].includes(tag)
      const addElementToSlideArea = (element, key) => {
        let area = key in slide ? slide[key] : domParser.parseFromString(`<div className="${key}"></div>`, "text/html").body.childNodes[0]
        area.appendChild(element)
        slide[key] = area
      }

      if (shouldStartNewSlide()) {
        if (slide != {})
          slides.push(slide)
        slide = {}
      }

      switch (tag) {
        case "H1":
          addElementToSlideArea(element, "title")
          break
        case "H2":
          addElementToSlideArea(element, "subtitle")
          break
        case "HR":
            break
        case "A":
          element.setAttribute("target", "_blank")
        default:
          addElementToSlideArea(element, "content")
          break
      }
    }

    slides.push(slide)
    return slides
  }

}

export default DeckPreview