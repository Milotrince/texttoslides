import React from "react"
import DeckEditor from "../components/DeckEditor"
import DeckPreview from "../components/DeckPreview"
import DeckTextImport from "../components/DeckTextImport"
import DeckThemeSelect from "../components/DeckThemeSelect"
import DeckDownloadButton from "../components/DeckDownloadButton"

class EditorLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = { }
  }

  render() {
    return (
      <div>

        <div className="actions-container">
            <div className="action">
              <DeckTextImport/>
            </div>
            <div className="action">
              <DeckThemeSelect/>
              <DeckDownloadButton/>
            </div>
        </div>

        <div id="editor-container">
            <div className="editor-column">
                <p className="label">editor</p>
                <DeckEditor onEditorChange={this.onEditorChange} />
            </div>
            <div className="gutter"></div>
            <div className="editor-column">
                <p className="label">preview</p>
                <DeckPreview editorContent={this.state.editorContent} />
            </div>
        </div>

      </div>
    )
  }

  onEditorChange = (value) => {
    console.log(value)
    this.setState({
      editorContent: value
    })
  }

  getDefaultText() {
    return (`
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
    )
  }

}

export default EditorLayout