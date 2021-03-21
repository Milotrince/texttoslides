import React from "react"

class DeckTextImport extends React.Component {

  defaultText = "Grab content from link. Works with most articles and Notion!"

  constructor(props) {
    super()
    this.state = {
      input: "",
      text: this.defaultText,
      textClass: ""
    }
  }

  render() {
    return (
      <div>
        <input onChange={e => this.handleChangeInput(e)} type="text" placeholder="Link"></input>
        <button onClick={e => this.handleClick(e)} aria-label="Import text content from link">Import text</button>
        <small className={this.state.textClass} >{this.state.text}</small>
      </div>
    )
  }

  handleChangeInput(event) {
    this.setState({
      input: event.target.value
    })
  }

  handleClick() {
    if (!this.isValidURL(this.state.input)) {
      this.setState({
        text: "Needs to be valid URL",
        textClass: "warning"
      })
      return false
    } 
    this.setState({
      text: this.defaultText,
      textClass: "" 
    })

    // TODO: Need to use cookies to show loading/done loading
    fetch(process.env.REACT_APP_SERVER_URL+"/grab", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ link: this.state.input })
    })
      .then(res => res.json())
      .then(data => {
        this.setSlideEditorContent(data.html)
      })
  }

  setSlideEditorContent(html) {
    console.log(html)
  }

  isValidURL(str) {
    var pattern = new RegExp("^(https?:\\/\\/)?"+ // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|"+ // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))"+ // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+ // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?"+ // query string
      "(\\#[-a-z\\d_]*)?$","i"); // fragment locator
    return !!pattern.test(str);
  }

}

export default DeckTextImport
