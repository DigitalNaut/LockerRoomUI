import * as React from "react";
import { useInput } from "../../controllers/hooks/useInput";
import { sendMsg } from "../../controllers/messages";

import styles from "./Compose.module.scss";
import { Link, Redirect } from "react-router-dom";

function Compose(props) {
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
    <>
      {(props.credentials && (
        <div className={styles.box}>
          {sendResult && !sendResult.message && (
            <>
              <div>Message sent.</div>
              <p>
                <span>From:{sendResult.sender}</span>
                <br />
                <span>To:{sendResult.recipient}</span>
              </p>
              {sendResult && (
                <>
                  <div>Message:</div>
                  <div>
                    <p>
                      {sendResult.subject}
                      <br />
                      {sendResult.body}
                      <br />
                      {sendResult.footer && <span>{sendResult.footer}</span>}
                    </p>
                  </div>
                  <label className={styles.messageActions}>
                    <div>
                      <Link to="/messages">Inbox</Link>
                      <br />
                      <button
                        name="sendAnother"
                        type="button"
                        onClick={handleSendAnother}>
                        Send another
                      </button>
                    </div>
                  </label>
                </>
              )}
            </>
          )}
          {sendResult && sendResult.message && (
            <>
              <p>{sendResult.message}</p>
              <label>
                <button name="submit" type="submit" onClick={handleReset}>
                  Retry
                </button>
              </label>
            </>
          )}
          {!sendResult && (
            <>
              {(warning && (
                <div>
                  {warning}
                  <br />
                  <label>
                    <button name="submit" type="submit" onClick={handleRetry}>
                      Retry
                    </button>
                  </label>
                </div>
              )) || (
                <form onSubmit={handleSubmit}>
                  <label>
                    To:
                    <input
                      type="text"
                      placeholder="Recipient"
                      {...bindRecipient}
                      autoFocus={true}
                    />
                  </label>
                  <br />
                  <br />
                  <label>
                    Subject:
                    <input type="text" placeholder="Subject" {...bindSubject} />
                  </label>
                  <br />
                  <label>
                    Body:
                    <input type="textbox" placeholder="Body" {...bindBody} />
                  </label>
                  <br />
                  <label>
                    Footer:
                    <input type="text" placeholder="Footer" {...bindFooter} />
                  </label>
                  <br />
                  <br />
                  <label className={styles.messageActions}>
                    <div>
                      <Link to="/dashboard">Cancel</Link>
                    </div>
                    <button name="submit" type="submit" onSubmit={handleSubmit}>
                      Send
                    </button>
                  </label>
                </form>
              )}
            </>
          )}
        </div>
      )) || (
        <>
          <p>No session found.</p>
          <p>
            You can <Link to="login">sign in here</Link>.
          </p>
        </>
      )}
    </>
  );
}

export default Compose;
