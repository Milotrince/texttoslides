import React from "react"

class DarkThemeButton extends React.Component {

  constructor(props) {
    super(props)

    let theme = localStorage.getItem("theme")
    if (!theme) {
      let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      theme = prefersDark ? "dark" : "light"
    }
    document.body.classList.toggle(theme+"-theme")

    this.state = { theme: theme }
  }

  render() {
    return (
      <button onClick={() => this.onClick}>
        {this.state.theme}
      </button>
    )
  }


  onClick() {
    this.setState(state => ({
      theme: state.theme == "dark" ? "light" : "dark"
    }));
  
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");

    localStorage.setItem("theme", this.state.theme);
  }

}

export default DarkThemeButton