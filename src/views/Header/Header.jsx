import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { loadCredentials } from "../../controllers/auth";

import styles from "./Header.module.scss";

function Header(props) {
  return (
    <div className={styles.component}>
      {props.credentials && props.credentials.username && (
        <>
          <div>Hello, {props.credentials.username}.</div>
          <div>
            <Link to="/logout">Logout</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;