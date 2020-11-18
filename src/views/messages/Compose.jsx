import * as React from "react";
import { useInput } from "../../controllers/hooks/useInput";
import { loadCredentials } from "../../controllers/auth";
import { sendMsg } from "../../controllers/messages";

import styles from "./Compose.module.scss";
import { Link } from "react-router-dom";

function Compose(props) {
  let [activeLogin, setActiveLogin] = React.useState(null);
  let [sendResult, setSendResult] = React.useState(null);

  React.useLayoutEffect(() => {
    let credentials = props.credentials || loadCredentials();

    let { username, token } = credentials || {};

    if (username && token) {
      setActiveLogin({ username, token });
    }

    // resetRecipient();
    // resetSubject();
    // resetBody();
    // resetFooter();
  }, []);

  let {
    value: msgRecipient,
    bind: bindRecipient,
    reset: resetRecipient,
  } = useInput("Lisa");
  let { value: msgSubject, bind: bindSubject, reset: resetSubject } = useInput(
    "Hello, Lisa"
  );
  let { value: msgBody, bind: bindBody, reset: resetBody } = useInput(
    "Hello there, how are you? It's your mom."
  );
  let { value: msgFooter, bind: bindFooter, reset: resetFooter } = useInput(
    "Call me at: 133-332-465"
  );

  function handleReset(event) {
    event.preventDefault();

    console.log("Reset");

    setSendResult(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let msg = {
      subject: msgSubject,
      body: msgBody,
      footer: msgFooter,
    };

    let response = await sendMsg(
      activeLogin.token,
      activeLogin.username,
      msgRecipient,
      msg
    );

    console.log("response:", response);

    let { id, message } = response;
    console.log("Obvious error:", id, response);

    console.log("Response: ", response);

    if (!response) return null;

    setSendResult(response);
  }

  return (
    <>
      {(activeLogin && (
        <>
          {activeLogin.username && (
            <div>Signed in as {activeLogin.username}.</div>
          )}
          {sendResult && !sendResult.message && (
            <>
              <div>
                Back to <Link to="/dashboard">dashboard</Link>
              </div>
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
                </>
              )}
            </>
          )}
          {sendResult && sendResult.message && (
            <>
              <p>{sendResult.message}</p>
              <label>
                <button name="submit" onClick={handleReset}>
                  Retry
                </button>
              </label>
            </>
          )}
          {!sendResult && (
            <form onSubmit={handleSubmit}>
              <label>
                Recipient:
                <input type="text" {...bindRecipient} />
              </label>
              <br />
              <label>
                Header:
                <input type="text" {...bindSubject} />
              </label>
              <br />
              <label>
                Body:
                <input type="text" {...bindBody} />
              </label>
              <br />
              <label>
                Footer:
                <input type="text" {...bindFooter} />
              </label>
              <br />
              <label>
                <button name="submit" onSubmit={handleSubmit}>
                  Send
                </button>
              </label>
            </form>
          )}
        </>
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
