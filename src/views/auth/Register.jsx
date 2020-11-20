import * as React from "react";
import { Link } from "react-router-dom";
import { useInput } from "../../controllers/hooks/useInput";

import { register } from "../../controllers/auth";

import styles from "./Register.module.scss";

function Register(props) {
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
          {warning}
          <br />{" "}
          <label>
            <button name="retry" type="button" onClick={resetWarning}>
              Retry
            </button>
          </label>
        </div>
      )) ||
        (registered && (
          <p>
            Registered successfully.
            <br />
            You can now <Link to="/login">login</Link>.
          </p>
        )) || (
          <>
            <form onSubmit={handleSubmit}>
              <label>
                Username:
                <input
                  type="text"
                  placeholder="Username"
                  {...bindUsername}
                  autofocus="true"
                />
              </label>
              <br />
              <label>
                Email:
                <input type="email" placeholder="Email" {...bindEmail} />
              </label>
              <br />
              <label>
                Password:
                <input
                  type="password"
                  placeholder="Password"
                  {...bindPasswordA}
                />
              </label>
              <br />
              <label>
                Confirm password:
                <input
                  type="password"
                  placeholder="Password"
                  {...bindPasswordB}
                />
              </label>
              <br />
              <label>
                <Link to="/">Cancel</Link>
                <button name="submit" type="submit" onSubmit={handleSubmit}>
                  Submit
                </button>
              </label>
            </form>
          </>
        )}
    </div>
  );
}

export default Register;
