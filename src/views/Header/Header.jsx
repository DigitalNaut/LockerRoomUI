import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { loadCredentials } from "../../controllers/auth";

import styles from "./Header.module.scss";

function Header(props) {
  let [username, setUsername] = React.useState("");
  let [role, setRole] = React.useState("");

  React.useEffect(() => {
    if (props.credentials) {
      setUsername(props.credentials.username);
      setRole(props.credentials.role);
    }

    console.log("Creds are:", props.credentials);
  }, [props.credentials]);

  return (
    <div className={styles.component}>
      {props.credentials && (
        <>
          <div>
            Hello, {role} {username}.
          </div>
          <div>
            <Link to="/logout">Logout</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
