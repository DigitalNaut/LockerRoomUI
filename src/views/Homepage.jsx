import * as React from "react";
import { Link, useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";

import styles from "./Homepage.module.scss";

function Homepage(props) {
  const history = useHistory();

  return (
    <div className={styles.component}>
      <h1 className={styles.header}>Homepage</h1>
      {(props.credentials && (
        <p>
          <Button onClick={() => history.push("/dashboard")}>Dashboard</Button>
        </p>
      )) || (
        <>
          <p>
            <Button variant="outlined" color="primary" onClick={() => history.push("/register")}>Register</Button>
            <Button variant="contained" color="primary" onClick={() => history.push("/login")}>
              Login
            </Button>
          </p>
        </>
      )}
    </div>
  );
}

export default Homepage;
