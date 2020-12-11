import * as React from "react";
import { useInput } from "../../controllers/hooks/useInput";
import { sendMessage } from "../../controllers/messages";

import {
  Button,
  Divider,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  actions: {},
  form: {
    display: "flex",
    flexDirection: "column",
    width: "60vw",
    minWidth: "400px",
    maxWidth: "860px",
  },
  formGroup: {
    margin: `${theme.spacing(3)}px 0px`,
    width: "inherit",
    ["& *"]: { width: "inherit" },
  },
}));

function Composer(props) {
  const classes = useStyles();
  let [sendResult, setSendResult] = React.useState(null);
  let [warning, setWarning] = React.useState("");

  function handleReset(event) {
    event.preventDefault();

    setSendResult(null);
  }

  function handleSendAnother(event) {
    props.resetFields();

    setSendResult(null);
  }

  async function handleRetry(event) {
    setWarning("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let { onSubmit } = props;

    if (typeof onSubmit !== "function") return;

    let response = props.onSubmit();
    setSendResult(response);
  }

  return <>{props.children}</>;
}

export default Composer;
