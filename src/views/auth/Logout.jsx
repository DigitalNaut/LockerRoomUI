import * as React from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { logout } from "../../controllers/auth";

import MuiAlert from "@material-ui/lab/Alert";
import { Button, CircularProgress, Typography } from "@material-ui/core";

import styles from "./Logout.module.scss";

function Logout(props) {
  const history = useHistory();
  let [loggedOut, setLoggedOut] = React.useState(false);
  let [warning, setWarning] = React.useState(null);

  React.useEffect(() => {
    async function action() {
      if (!props.credentials) return;

      await logout(props.credentials.token);

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
            <MuiAlert severity="error">
              There was an error logging you out.
            </MuiAlert>
          )) || (
            <>
              <MuiAlert severity="success">You've been logged out.</MuiAlert>{" "}
              <div>
                <Button variant="outlined" onClick={() => history.push("/")}>
                  Homepage
                </Button>
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => history.push("/login")}>
                  Login here
                </Button>
              </div>
            </>
          )}
        </>
      )) ||
        (props.credentials && loggedOut && (
          <>
            <div>We couldn't log you out, {props.credentials.username}</div>
            <div>
              <Link to="/dashboard">Go back</Link> to the dashboard
            </div>
          </>
        )) ||
        (!props.credentials && !loggedOut && (
          <Redirect push to="/login"/>
        )) || (
          <>
            <Typography>Logging you out...</Typography>
            <br />
            <CircularProgress />
          </>
        )}
    </div>
  );
}

export default Logout;
