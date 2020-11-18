import * as React from "react";
import { useInput } from "../../controllers/hooks/useInput";
import {
  login,
  saveCredentials,
  loadCredentials,
} from "../../controllers/auth";
import { Redirect } from "react-router-dom";

import styles from "./Login.module.scss";

function Login(props) {
  let [activeLogin, setActiveLogin] = React.useState(null);
  let [loginInput, setLoginInput] = React.useState(null);

  React.useLayoutEffect(() => {
    let credentials = props.credentials || loadCredentials();

    let { username, token } = credentials || {};

    console.log(`Credentials ${credentials} found for ${username}:`, token);

    if (username && token) {
      setActiveLogin({ username, token });
    }
  }, []);

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

    let creds = {
      username: username,
      password: password,
    };

    let response = await login(creds);

    if (!response) return false;

    setLoginInput(response);

    let { token } = response || {};

    if (username && token) creds = saveCredentials({ username, token });

    setActiveLogin(creds);

    resetUsername();
    resetPassword();

    return true;
  };

  return (
    <>
      {loginInput && <div>{loginInput.message}</div>}
      {activeLogin && <Redirect to="/dashboard" />}
      {!activeLogin && (
        <>
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
        </>
      )}
    </>
  );
}

export default Login;
