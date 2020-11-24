import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { useInput } from "../../controllers/hooks/useInput";

import { register } from "../../controllers/auth";

import { Button, TextField } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import styles from "./Register.module.scss";

function Register(props) {
  const history = useHistory();
  let [warning, setWarning] = React.useState("");
  let [registered, setRegistered] = React.useState(null);

  const {
    value: username,
    bind: bindUsername,
    reset: resetUsername,
  } = useInput("");
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const {
    value: passwordA,
    bind: bindPasswordA,
    reset: resetPasswordA,
  } = useInput("");
  const {
    value: passwordB,
    bind: bindPasswordB,
    reset: resetPasswordB,
  } = useInput("");

  function resetWarning() {
    setWarning("");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordA !== passwordB) return setWarning("Passwords do not match.");

    let credentials = {
      username: username,
      email: email,
      password: passwordA,
    };

    let response = await register(credentials);

    if (!response)
      return setWarning(
        response.message ? response.message : "Error: Could not register you."
      );
    if (response.status === 409) return setWarning(response.message);

    if (!response.username)
      return setWarning(
        response.message
          ? response.message
          : "Could not register you with server."
      );

    setRegistered(true);

    resetUsername();
    resetPasswordA();
    resetPasswordB();
    resetEmail();
  };

  return (
    <div className={styles.component}>
      {(warning && (
        <div>
          <MuiAlert severity="warning">{warning}</MuiAlert>
          <br />
          <Button
            color="primary"
            type="button"
            onClick={() => {
              history.push("/");
            }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            label="retry"
            type="button"
            onClick={resetWarning}>
            Retry
          </Button>
        </div>
      )) ||
        (registered && (
          <>
            <MuiAlert severity="success">Registered successfully.</MuiAlert>
            <br />
            <p>
              You may now <Link to="/login">login</Link>.
            </p>
          </>
        )) || (
          <>
            <form onSubmit={handleSubmit}>
              <TextField
                required
                label="Username"
                {...bindUsername}
                autoFocus={true}
              />
              <br />
              <TextField required label="Email" {...bindEmail} />
              <br />
              <TextField
                required
                label="Password"
                type="password"
                {...bindPasswordA}
              />
              <br />
              <TextField
                required
                label="Confirm password"
                type="password"
                {...bindPasswordB}
              />
              <br />
              <div>
                <Button color="primary" onClick={() => history.push("/")}>
                  Cancel
                </Button>
                <Button
                  name="submit"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onSubmit={handleSubmit}>
                  Submit
                </Button>
              </div>
            </form>
          </>
        )}
    </div>
  );
}

export default Register;
