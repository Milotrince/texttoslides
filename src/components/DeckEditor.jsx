import React from "react"
import PropTypes from "prop-types"
import ContentEditable from "react-contenteditable"

class DeckEditor extends React.Component {

  static propTypes = {
    onEditorChange: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.contentEditable = React.createRef()
    this.state = {content: this.getDefaultText()}
  }

  render() {
    return (
      <ContentEditable
        innerRef={this.contentEditable}
        html={this.state.content} // innerHTML of the editable div
        disabled={false}       // use true to disable editing
        onChange={this.handleChange} // handle innerHTML change
        tagName='article' // Use a custom HTML tag (uses a div by default)
      />
    )
  }

  handleChange = (event) => {
    console.log(event.target.value)
    this.setState({html: event.target.value})
    this.props.onEditorChange(event.target.value)
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