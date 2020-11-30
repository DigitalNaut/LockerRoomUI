import * as React from "react";
import { useStringInput } from "../../controllers/hooks/useInput";
import { sendMessage } from "../../controllers/messages";

import {
  Button,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import CountedTextField from "../../components/CountedTextField";

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
    ["& > :not(:first-child)"]: {
      marginBottom: theme.spacing(1.5),
    },
  },
  formGroup: {
    margin: `${theme.spacing(3)}px 0px`,
    width: "inherit",
    ["& *"]: { width: "inherit" },
  },
  halfWidthField: {
    width: "50%",
  },
  threeQuarterField: {
    width: "75%",
  },
}));

function Composer(props) {
  const classes = useStyles();
  let [sendResult, setSendResult] = React.useState(null);
  let [alert, setAlert] = React.useState("");

  let {
    value: msgRecipient,
    bind: bindRecipient,
    reset: resetRecipient,
  } = useStringInput("");
  let {
    value: msgSubject,
    bind: bindSubject,
    reset: resetSubject,
  } = useStringInput("");
  let { value: msgBody, bind: bindBody, reset: resetBody } = useStringInput("");
  let {
    value: msgFooter,
    bind: bindFooter,
    reset: resetFooter,
  } = useStringInput("");

  function handleReset(event) {
    event.preventDefault();

    setSendResult(null);
  }

  function handleSendAnother(event) {
    resetRecipient();
    resetSubject();
    resetBody();
    resetFooter();

    setSendResult(null);
  }

  async function handleRetry(event) {
    setAlert("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let msg = {
      subject: msgSubject,
      body: msgBody,
      footer: msgFooter,
    };

    if (!msg.subject) return setAlert("Your message does not have a subject.");

    let response = await sendMessage(
      props.credentials.token,
      props.credentials.username,
      msgRecipient,
      msg
    );

    if (!response) return null;

    setSendResult(response);
  }

  return (
    <div className={classes.root}>
      {props.credentials && (
        <>
          {sendResult && (
            <>
              {!sendResult.message && (
                <MuiAlert severity="success">Message sent.</MuiAlert>
              )}
              {sendResult.message && (
                <>
                  <MuiAlert severity="warning">{sendResult.message}</MuiAlert>
                  <br />
                  <Button
                    name="submit"
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleReset}>
                    Retry
                  </Button>
                </>
              )}
            </>
          )}

          {alert && (
            <div>
              <MuiAlert severity="warning">{alert}</MuiAlert>
              <br />
              <Button
                name="submit"
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleRetry}>
                Retry
              </Button>
            </div>
          )}
          {!alert && (
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className={classes.form}>
              <Typography variant="h6" color="textSecondary">
                {`Inbox﹥New Message`}
              </Typography>
              <TextField
                label="To"
                className={classes.halfWidthField}
                disabled={sendResult ? true : false}
                required
                {...bindRecipient}
                autoFocus={true}
                />
              <CountedTextField
                label="Subject"
                disabled={sendResult ? true : false}
                required
                binder={bindSubject}
                charLimit={25}
              />
              <br />
              <CountedTextField
                label="Message"
                disabled={sendResult ? true : false}
                multiline
                rows={8}
                binder={bindBody}
                charLimit={255}
              />
              <br />

              {(sendResult && (
                <>
                  <label className={classes.actions}>
                    <div>
                      <Button
                        name="sendAnother"
                        type="button"
                        variant="outlined"
                        onClick={handleSendAnother}>
                        Send another
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => props.history.push("/messages")}>
                        Inbox
                      </Button>
                    </div>
                  </label>
                </>
              )) || (
                <label>
                  <Button
                    variant="outlined"
                    onClick={() => props.history.goBack()}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    onSubmit={handleSubmit}>
                    Send
                  </Button>
                </label>
              )}
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default Composer;
