import { TextField } from "@material-ui/core";
import * as React from "react";

class TabbedTextField extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  
  componentDidMount() {
    this.focusTextInput = this.focusTextInput.apply(this.textInput.current.children[1].children[0]);
  }

  focusTextInput() {
    // https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node

    this.addEventListener('keydown', function(e) {
      
      if (e.key == 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
    
        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) +
          "\t" + this.value.substring(end);
    
        // put caret at right position again
        this.selectionStart =
          this.selectionEnd = start + 1;
      }
    });
  }

  render() {
    return <TextField {...this.props} ref={this.textInput} />;
  }
}

export default TabbedTextField;
