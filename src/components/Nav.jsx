import React from "react"
import DarkThemeButton from "./DarkThemeButton"

class Nav extends React.Component {

  render() {
    return (
      <nav aria-label="main navigation">
        <div className="nav-item">
          <a href="/" className="nav-logo">texttoslides</a>
        </div>
        <div className="nav-item">
          <DarkThemeButton/>
        </div>
      </nav>
    )
  }

}

export default Nav