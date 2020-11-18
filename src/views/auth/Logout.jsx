import * as React from "react";
import { Link } from "react-router-dom";
import { logout, loadCredentials } from "../../controllers/auth";

import styles from "./Logout.module.scss";

function Logout(props) {
  let [activeLogin, setActiveLogin] = React.useState(null);

  React.useEffect(async () => {
    await logout();
    let credentials = loadCredentials();
    if (credentials) setActiveLogin();
  }, []);

  return (
    <>
      {(activeLogin && (
        <div>We couldn't log you out, {activeLogin.username}</div>
      )) || <div>You've been logged out.</div>}
      <p>
        You can <Link to="/login">login here</Link>.
      </p>
    </>
  );
}

export default Logout;
