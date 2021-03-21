import React from "react"
import PropTypes from "prop-types"

class DeckEditor extends React.Component {

  static propTypes = {
    onEditorChange: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = { content : this.getDefaultText() }
    this.props.onEditorChange(this.state.content)
  }

  render() {
    return (
      <div id="editor" contentEditable="true" onChange={(e) => this.handleChange(e)} suppressContentEditableWarning={true}>
          {
            this.state.content
          }
      </div>
    )
  }

  handleChange(event) {
    console.log(event.target.value)
    this.setState({
      content: event.target.value
    })
    this.props.onEditorChange(this.state.content)
  }


  getDefaultText() {
    let text = `
      # Presentation Title
      ## Subtitle


      # Section Slide
      ## Section Subtitle

      This is the description of this section.

      **Some bold text**,
      *some italicized text*

      [a mysterious link](http://random.cat)


      # Slide Title
      These words are part of the body.
      * bulleted
      * list
      1. numbered
      2. list

      --------

      dashed line, new slide
      `
      return text.split('\n').map(function(line, i) {
        return line.length == 0 ? <div key={i}><br/></div> : <div key={i}>{line}</div>
      })
  }

}

export default DeckEditor