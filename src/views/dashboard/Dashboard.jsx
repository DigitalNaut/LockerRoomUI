import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { loadCredentials } from "../../controllers/auth";

import styles from "./Dashboard.module.scss";

function Dashboard(props) {


  return (
    <div className={styles.component}>
      {(props.credentials && (
        <>
          {props.credentials.username && (
            <div>Hello, {props.credentials.username}.</div>
          )}
          <br />
          <div>
            You can <Link to="/logout">click here</Link> to logout.
          </div>
          <ul>
            <li>
              <Link to="/messages">View your inbox</Link>
            </li>
            <li>
              <Link to="/message/new">Send a new message</Link>
            </li>
            <li>Raise a new petition</li>
            <li>Respond to an event</li>
          </ul>
        </>
      )) || (
        <>
          <p>Session not started.</p>
          <p>
            Please <Link to="/login">sign in</Link>.
          </p>
        </>
      )}
    </div>
  );
}

export default Dashboard;
