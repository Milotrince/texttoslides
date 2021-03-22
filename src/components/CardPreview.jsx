import React from "react"
import PropTypes from "prop-types"

class CardPreview extends React.Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
        layout: this.identifyLayout(),
        style: {
          fontSize: window.innerWidth * 0.02 + "px"
        }
    }
  }

  render() {
    return (
        <div className="slide-wrapper">
            <div className={"slide "+this.state.layout} style={this.state.style}>
              {
                Object.keys(this.props.data).map((key, i) => {
                  return (
                    <div key={i} ref={ref => {
                      if (ref) {
                        ref.innerHTML = ""
                        return ref.appendChild(this.props.data[key])
                      }
                      }}>
                    </div>
                  )
                })
              }
            </div>
        </div>
    )
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    this.setState({
        style: {
            fontSize: window.innerWidth * 0.02 + "px"
        }
    })
  }


  identifyLayout = () => {
    let layout = "content-layout"
    let sections = Object.keys(this.props.data)
    if (sections.includes("title") && sections.includes("subtitle") && sections.includes("content")) {
        layout = "section-layout"
    } else if (sections.includes("title") && (sections.includes("subtitle") || !sections.includes("content") )) {
        layout = "title-layout"
    }
    return layout
  }

}

export default CardPreview