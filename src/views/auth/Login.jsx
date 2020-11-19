import * as React from "react";
import { useInput } from "../../controllers/hooks/useInput";
import { login, saveCredentials } from "../../controllers/auth";
import { Redirect } from "react-router-dom";

import styles from "./Login.module.scss";

function Login(props) {
  let [warning, setWarning] = React.useState(null);

  const {
    value: username,
    bind: bindUsername,
    reset: resetUsername,
  } = useInput("marge");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput("12343333");

  const handleSubmit = async (event) => {
    event.preventDefault();

    let message =
      (username && `Submitting: ${username}${password && " : " + password}`) ||
      "Please submit a username and a valid password.";

    let credentials = {
      username: username,
      password: password,
    };

    let response = await login(credentials);
    if (!response)
      return setWarning(
        response.message ? response.message : "Could not log you in."
      );

    let { token } = response || {};
    if (!username || !token)
      setWarning(response.message ? response.message : "Error signing you in.");

    let savedCredentials = JSON.parse(saveCredentials({ username, token }));

    if (!savedCredentials)
      setWarning(
        response.message ? response.message : "Could not store your session."
      );

    props.setActiveLogin(savedCredentials);

    resetUsername();
    resetPassword();
  };

  return (
    <>
      {props.credentials && <Redirect to="/dashboard" />}
      {warning && <div>{warning.message}</div>}
      {!props.credentials && (
        <div className={styles.component}>
          <div>You're not logged in.</div>
          <br />
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input type="text" {...bindUsername} />
            </label>
            <br />
            <label>
              Password:
              <input type="password" {...bindPassword} />
            </label>
            <br />
            <label>
              <button name="submit" onSubmit={handleSubmit}>
                Submit
              </button>
            </label>
          </form>
        </div>
      )}
    </>
  );
}

export default Login;
