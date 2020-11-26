import * as React from "react";
import { useInput } from "../../controllers/hooks/useInput";
import { sendMsg } from "../../controllers/messages";

import styles from "./Compose.module.scss";
import { useHistory } from "react-router-dom";

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
  form: {
    display: "flex",
    flexDirection: "column",
    width: "60vw",
    minWidth: "400px",
    maxWidth: "860px",
  },
}));

function Compose(props) {
  const classes = useStyles();
  const history = useHistory();
  let [sendResult, setSendResult] = React.useState(null);
  let [warning, setWarning] = React.useState("");

  let {
    value: msgRecipient,
    bind: bindRecipient,
    reset: resetRecipient,
  } = useInput("");
  let { value: msgSubject, bind: bindSubject, reset: resetSubject } = useInput(
    ""
  );
  let { value: msgBody, bind: bindBody, reset: resetBody } = useInput("");
  let { value: msgFooter, bind: bindFooter, reset: resetFooter } = useInput("");

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
    setWarning("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let msg = {
      subject: msgSubject,
      body: msgBody,
      footer: msgFooter,
    };

    if (!msg.subject)
      return setWarning("Your message does not have a subject.");

    let response = await sendMsg(
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
          {sendResult && !sendResult.message && (
            <div className={classes.root}>
              <div className={classes.form}>
                <MuiAlert severity="success">Message sent.</MuiAlert>
                <TextField
                  label="To"
                  disabled
                  value={sendResult.recipient}
                  autoFocus={true}
                />
                <Divider />
                {sendResult && (
                  <>
                    <TextField
                      label="Subject"
                      disabled
                      value={sendResult.subject}
                      autoFocus={true}
                    />
                    <br />
                    <TextField
                      disabled
                      value={`${sendResult.body}\n${sendResult.footer}`}
                      multiline
                    />
                    <label className={styles.messageActions}>
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
                )}
              </div>
            </div>
          )}
          {sendResult && sendResult.message && (
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
          {!sendResult && (
            <>
              {(warning && (
                <div>
                  <MuiAlert severity="warning">{warning}</MuiAlert>
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
              )) || (
                <form
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  className={classes.form}>
                  <Typography variant="h6" color="textSecondary">
                    {`Inbox﹥New Message`}
                  </Typography>
                  <TextField label="To" {...bindRecipient} autoFocus={true} />
                  <Divider />
                  <TextField label="Subject" {...bindSubject} />
                  <br />
                  <TextField label="Body" multiline rows={8} {...bindBody} />
                  <br />
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
                </form>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Compose;
