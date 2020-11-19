import * as React from "react";
import { Link } from "react-router-dom";
import { loadCredentials } from "../controllers/auth";

import styles from "./Homepage.module.scss";

function Homepage(props) {
  return (
    <div className={styles.component}>
      <h1 className={styles.header}>Homepage</h1>
      {(props.credentials && (
        <p>
          <Link to="/dashboard">Dashboard</Link>
        </p>
      )) || (
        <>
          <p>
            <Link to="/register">Register</Link>
            <br />
            <Link to="/login">Login</Link>
          </p>
        </>
      )}
    </div>
  );
}

export default Homepage;
