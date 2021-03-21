import React from "react"
import Nav from "./components/Nav"
import EditorLayout from "./layouts/EditorLayout"
import "./styles/main.css"

class App extends React.Component {

  render() {
    return (
      <div>
        <Nav/>
        <EditorLayout/>
      </div>
    )
  }

}

export default App