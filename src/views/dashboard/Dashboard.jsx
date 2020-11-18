import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { loadCredentials } from "../../controllers/auth";

import styles from "./Dashboard.module.scss";

function Dashboard(props) {
  let [activeLogin, setActiveLogin] = React.useState(null);

  React.useLayoutEffect(() => {
    let credentials = props.credentials || loadCredentials();

    let { username, token } = credentials || {};

    if (username && token) {
      setActiveLogin({ username, token });
    }
  }, []);

  return (
    <>
      {(activeLogin && (
        <>
          {activeLogin.username && <div>Hello, {activeLogin.username}.</div>}
          <p>
            You can <Link to="/logout">click here</Link> to logout.
          </p>
          <p>
            <Link to="/messages">View your inbox</Link>
          </p>
          <p>
            <Link to="/message/new">Send a new message</Link>
          </p>
          {<p>Raise a new petition</p>}
          {<p>Respond to an event</p>}
        </>
      )) || <><p>Session not started.</p><p>Please <Link to="/login">sign in</Link>.</p></>}
    </>
  );
}

export default Dashboard;
