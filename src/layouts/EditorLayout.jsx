import React from "react"
import DeckEditor from "../components/DeckEditor"
import DeckPreview from "../components/DeckPreview"
import DeckTextImport from "../components/DeckTextImport"
import DeckThemeSelect from "../components/DeckThemeSelect"
import DeckDownloadButton from "../components/DeckDownloadButton"

class EditorLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = { 
      editorContent: this.getDefaultText(),
      slideTheme: "default"
    }
  }

  render() {
    return (
      <div>

        <div className="actions-container">
            <div className="action">
              <DeckTextImport setSlideEditorContent={this.handleEditorChange} />
            </div>
            <div className="action">
              <DeckThemeSelect handleChange={this.handleThemeChange} />
              <DeckDownloadButton/>
            </div>
        </div>

        <div id="editor-container">
            <div className="editor-column">
                <p className="label">editor</p>
                <DeckEditor content={this.state.editorContent} handleChange={this.handleEditorChange} />
            </div>
            <div className="gutter"></div>
            <div className="editor-column">
                <p className="label">preview</p>
                <DeckPreview className={"theme-"+this.state.slideTheme} editorContent={this.state.editorContent} />
            </div>
        </div>

      </div>
    )
  }

  handleThemeChange = (value) => {
    this.setState({
      slideTheme: value
    })
  }

  handleEditorChange = (value) => {
    this.setState({
      editorContent: value
    })
  }

  getDefaultText() {
    return `
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
      `.split('\n').map(function(line) {
        return line.length == 0 ? `<div><br/></div>` : `<div>${line}</div>`
      }).join("")
  }

}

export default EditorLayout