import React from "react"
import PropTypes from "prop-types"

class DeckThemeSelect extends React.Component {

  static propTypes = {
    onChangeTheme: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      theme: "default",
      themes: ["fancy", "whimsical"]
    }
  }

  onChange(event) {
    console.log(event.target.value)
    this.props.onChangeTheme(event.target.value)
    // change #preview clas to theme-{val}
  }

  render() {
    return (
      <select id="theme" onChange={this.onChange}>
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