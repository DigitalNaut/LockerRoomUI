import * as React from "react";
import { loadCredentials } from "../../controllers/auth";
import { viewInbox } from "../../controllers/messages";

import styles from "./Inbox.module.scss";
import { Link } from "react-router-dom";

function Inbox(props) {
  let [activeLogin, setActiveLogin] = React.useState(null);
  let [inbox, setInbox] = React.useState([]);

  React.useLayoutEffect(() => {
    async function init() {
      let credentials = props.credentials || loadCredentials();

      let { username, token } = credentials || {};

      if (username && token) {
        setActiveLogin({ username, token });
      }
      setInbox(await viewInbox(token));
    }
    init();
  }, []);

  return (
    <>
      {(activeLogin && (
        <>
          {activeLogin.username && (
            <>
              <div>Signed in as {activeLogin.username}.</div>
              <div>
                Back to <Link to="/dashboard">dashboard</Link>
              </div>
            </>
          )}
          {(inbox &&
            inbox.length &&
            inbox.map((message, i) => {
              return (
                <div key={i}>
                  <p>From:{message.sender}</p>
                  <p>To:{message.recipient}</p>
                  <div>Message:</div>
                  <div>
                    <p>{message.subject}</p>
                    <p>{message.body}</p>
                    <p>{message.footer}</p>
                  </div>
                </div>
              );
            })) || <p>Inbox is empty.</p>}
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

export default Inbox;
