import * as React from "react";
import { viewInbox } from "../../controllers/messages";

import styles from "./Inbox.module.scss";
import { Link } from "react-router-dom";

function Inbox(props) {
  let [messages, setMessages] = React.useState([]);
  let [senders, setSenders] = React.useState([]);
  let [thread, setThread] = React.useState([]);

  function onSelectThread(sender) {
    setThread(messages[sender]);
  }

  React.useLayoutEffect(() => {
    setSenders(Object.keys(messages));
  }, [messages]);

  React.useLayoutEffect(() => {
    async function init() {
      if (props.credentials)
        setMessages(await viewInbox(props.credentials.token));
    }
    init();
  }, [props.credentials]);

  return (
    <div className={styles.component}>
      <div>
        <Link to="/dashboard">Dashboard</Link>
        <br />
        <Link to="/message/new">New message</Link>
      </div>
      {(props.credentials && (
        <div className={styles.inbox}>
          <div className={styles.senders}>
            {(senders.length &&
              senders.map((sender, i) => {
                return (
                  <div
                    key={i}
                    className={styles.sender}
                    onClick={(event) => onSelectThread(sender)}>
                    {sender}
                  </div>
                );
              })) || <p>Your inbox is empty.</p>}
          </div>
          <div className={styles.thread}>
            {(thread.length &&
              thread.map((message, i) => {
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
              })) || <p>No conversation selected.</p>}
          </div>
        </div>
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
