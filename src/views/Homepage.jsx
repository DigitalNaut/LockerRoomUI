import * as React from "react";
import { Link } from "react-router-dom";
import { loadCredentials } from "../controllers/auth";

import styles from "./Homepage.module.scss";

function Homepage(props) {
  let [activeLogin, setActiveLogin] = React.useState(null);

  React.useLayoutEffect(() => {
    let credentials = props.credentials || loadCredentials();

    let { username, token } = credentials || {};

    if (username && token) {
      setActiveLogin({ username, token });
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Homepage</h1>
      <p>
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Homepage;
