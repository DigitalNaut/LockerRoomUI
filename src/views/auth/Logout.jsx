import * as React from "react";
import { Link } from "react-router-dom";
import { logout, loadCredentials } from "../../controllers/auth";

import styles from "./Logout.module.scss";

function Logout(props) {
  let [loggedOut, setLoggedOut] = React.useState(false);

  React.useEffect(() => {
    async function action() {
      if (!props.credentials) return;

      let result = await logout(props.credentials.token);

      props.setActiveLogin(null);

      setLoggedOut(true);
    }
    return action();
  }, []);

  return (
    <div className={styles.component}>
      {(loggedOut && (
        <>
        {(props.credentials && (
            <div>There was an error logging you out.</div>
          )) || <div>You've been logged out.</div>}
        </>
      )) ||
        (props.credentials && (
          <>
            <div>We couldn't log you out, {props.credentials.username}</div>
            <div>
              <Link to="/dashboard">Go back</Link> to the dashboard
            </div>
          </>
        )) || (
          <p>
            You're not logged in. <br />{" "}
          </p>
        )}
      {
        <p>
          You can <Link to="/login">login here</Link>.
        </p>
      }
    </div>
  );
}

export default Logout;
