import React from "react"
import PropTypes from "prop-types"
import CardPreview from "./CardPreview"
import md from "markdown-it"

class DeckPreview extends React.Component {

  static propTypes = {
    setEditorContent: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
        <div id="preview" className="theme-default">
          {
            this.renderSlides()
          }

        </div>
    )
  }

  renderSlides() {
    if (!this.props.editorContent)
      return

    let text = ""
    this.props.editorContent.forEach(element => {
      console.log(element.props.children)

      text += element.props.children + "\n"
    })
    // for (let element in this.props.editorContent) {
    // }
    console.log(text)

  }

}

export default DeckPreview



// function updatePreview() {
//   let text = ""
//   $("#editor").children().each(function () {
//       text += $(this).text() + "\n"
//   })
//   let mdRender = md.render(text)

//   let $slides = $(`<div></div>`)
//   let $slide = $()
//   let tag = ""
//   $($.parseHTML(`<div>${mdRender}</div>`)).children().each(function() {
//       tag = $(this).prop("tagName").toLowerCase()

//       if (shouldStartNewSlide()) {
//           addCurrentSlide()
//           $slide = $(`<div class="slide"></div>`)
//       }

//       switch (tag) {
//           case "h1":
//               getSlideTextArea("title").append(this)
//               break
//           case "h2":
//               getSlideTextArea("subtitle").append(this)
//               break
//           case "hr":
//               break
//           default:
//               getSlideTextArea("content").append(this)
//               break
//       }
//   })
//   addCurrentSlide()

//   $("#preview").html($slides)

//   $("#preview a").attr("target", "_blank");

//   function getSlideTextArea(name) {
//       let $search = $slide.children(`.${name}`)
//       return $search.length > 0 ? $search : $slide.append(`<div class="text ${name}"></div>`).find(`.${name}`)
//   }

//   function shouldStartNewSlide() {
//       let breaks = ["hr", "h1"]
//       return breaks.includes(tag)
//   }

//   function addCurrentSlide() {
//       $slide.addClass(identifyLayout())
//       $slides.append($slide.wrap(`<div class="slide-wrapper"></div>`).parent())
//   }

//   function identifyLayout() {
//       let layout = "content-layout"
//       let sections = []
//       $slide.children().each(function() {
//           sections.push($(this).attr("class").split(" ")[1])
//       })

//       if (sections.includes("title") && sections.includes("subtitle") && sections.includes("content")) {
//           layout = "section-layout"
//       } else if (sections.includes("title") && (sections.includes("subtitle") || !sections.includes("content") )) {
//           layout = "title-layout"
//       }

//       return layout
//   }

// }