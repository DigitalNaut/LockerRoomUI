import { withStyles, TextField } from "@material-ui/core";
import * as React from "react";

const useStyles = (theme) => {
  return {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
    },
    badge: {
      position: "absolute",
      height: "0",
      right: "0",
      bottom: "0",
      fontSize: "70%",
      color: theme.palette.text.hint,
    },
    red: {
      color: "red !important",
    },
  };
};

class CountedTextField extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = { length: -1, isHidden: true };
  }

  componentDidMount() {
    let target = this.textInput.current.children[1].children[0];
    this.updateState = this.updateState.bind(this);
    this.handleInput = this.handleInput.apply(target, [this.updateState]);
  }

  updateState(length, isHidden) {
    this.setState({
      length,
      isHidden,
    });
  }

  handleInput(callback) {
    this.addEventListener("keydown", function (e) {
      // if (e.key == "Tab") {
      //   e.preventDefault();
      //   var start = this.selectionStart;
      //   var end = this.selectionEnd;

      //   this.value =
      //     this.value.substring(0, start) + "\t" + this.value.substring(end);

      //   this.selectionStart = this.selectionEnd = start + 1;
      // } else

      callback(this.value.length, false);
    });

    this.addEventListener("keyup", (e) => callback(this.value.length, false));
    this.addEventListener("focus", (e) => callback(this.value.length, false));
    this.addEventListener("blur", (e) => callback(this.value.length, true));

    callback(this.value.length, true);
  }

  render() {
    let { classes, charLimit, className, binder, ...otherProps } = this.props;
    let { length, isHidden } = this.state;
    let overlimit = length - charLimit > 0 ? true : false;

    return (
      <div className={`${classes.root} ${className}`}>
        <TextField ref={this.textInput} {...otherProps} {...binder} />

        <div
          className={`${classes.badge} ${overlimit ? classes.red : ""}`}
          hidden={isHidden && !overlimit}>
          {`${length}/${charLimit} ${overlimit ? "Over limit!" : ""}`}
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(CountedTextField);
