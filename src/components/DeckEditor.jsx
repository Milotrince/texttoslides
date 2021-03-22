import React from "react"
import PropTypes from "prop-types"
import ContentEditable from "react-contenteditable"

class DeckEditor extends React.Component {

  static propTypes = {
    content: PropTypes.string,
    handleChange: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.contentEditable = React.createRef()
  }

  render() {
    return (
      <ContentEditable
        id="editor"
        innerRef={this.contentEditable}
        html={this.props.content}
        disabled={false}
        onChange={(event) => this.props.handleChange(event.target.value)}
      />
    )
  }


}

export default DeckEditor