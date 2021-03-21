import React from "react"

class CardPreview extends React.Component {

  constructor(props) {
    super()
    this.state = {
        layout: "content-layout"
    }
  }

  render() {
    return (
        <div className="slide-wrapper">
            <div className={"slide "+this.state.layout} style={this.state.style}>
              test

            </div>
        </div>
    )
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.handleResize)
  }

  handleResize() {
    this.setState({
        style: {
            fontSize: window.innerWidth * 0.1 + "px"
        }
    })
  }

}

export default CardPreview


// function getSlideTextArea(name) {
//     let $search = $slide.children(`.${name}`)
//     return $search.length > 0 ? $search : $slide.append(`<div class="text ${name}"></div>`).find(`.${name}`)
// }

// function addCurrentSlide() {
//     $slide.addClass(identifyLayout())
//     $slides.append($slide.wrap(`<div class="slide-wrapper"></div>`).parent())
// }

// function identifyLayout() {
//     let layout = "content-layout"
//     let sections = []
//     $slide.children().each(function() {
//         sections.push($(this).attr("class").split(" ")[1])
//     })

//     if (sections.includes("title") && sections.includes("subtitle") && sections.includes("content")) {
//         layout = "section-layout"
//     } else if (sections.includes("title") && (sections.includes("subtitle") || !sections.includes("content") )) {
//         layout = "title-layout"
//     }

//     return layout
// }