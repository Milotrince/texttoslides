import React from "react"
import PropTypes from "prop-types"

class DeckThemeSelect extends React.Component {

  static propTypes = {
    handleChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      theme: "default",
      themes: ["fancy", "whimsical"]
    }
  }

  render() {
    return (
      <select id="theme" onChange={(event) => this.props.handleChange(event.target.value)}>
          <option value="default">Select theme</option>
          {
            this.state.themes.map(function(theme, i) {
              return <option key={i} value={theme}>{theme}</option>
            })
          }
      </select>
    )
  }

}

export default DeckThemeSelect