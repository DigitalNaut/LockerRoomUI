import * as React from "react";
import { loadCredentials } from "../../controllers/auth";
import { viewInbox } from "../../controllers/messages";

import styles from "./Inbox.module.scss";
import { Link } from "react-router-dom";

function Inbox(props) {
  let [inbox, setInbox] = React.useState([]);

  React.useLayoutEffect(() => {
    async function init() {
      if (props.credentials) setInbox(await viewInbox(props.credentials.token));
    }
    init();
  }, [props.credentials]);

  return (
    <div className={styles.component}>
      {(props.credentials && (
        <>
          <div className={styles.inbox}>
            <Link to="/dashboard">Dashboard</Link>
            <br />
            <Link to="/message/new">New message</Link>
            {(inbox &&
              inbox.length &&
              inbox.map((message, i) => {
                return (
                  <div key={i} className={styles.message}>
                    <div className={styles.messageField}>
                      <b>From: </b>
                      {message.sender}
                      <br />
                      <b>To: </b>
                      {message.recipient}
                    </div>
                    <div className={styles.messageField}>
                      <p>
                        <b>Subject: </b>
                        {message.subject}
                      </p>
                      <div className={styles.messageBody}>
                        {message.body}
                        <p>{message.footer}</p>
                      </div>
                    </div>
                  </div>
                );
              })) || <p>Inbox is empty.</p>}
          </div>
        </>
      )) || (
        <>
          <p>No session found.</p>
          <p>
            You can <Link to="login">sign in here</Link>.
          </p>
        </>
      )}
    </div>
  );
}

export default Inbox;
