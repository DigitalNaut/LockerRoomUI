import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { useStringInput } from "../../controllers/hooks/useInput";

import { register } from "../../controllers/auth";

import { Button, makeStyles, TextField, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    minWidth: "400px",
    maxWidth: "860px",
    ["& > *"]: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      marginBottom: theme.spacing(1.5),
    },
  },
  inlineField: {
    display: "flex",
    flexDirection: "row",
    ["& > :not(:last-child)"]: {
      marginRight: "30px",
    },
  },
}));

function Register(props) {
  const classes = useStyles();
  const history = useHistory();
  let [warning, setWarning] = React.useState("");
  let [registered, setRegistered] = React.useState(null);

  const {
    value: username,
    bind: bindUsername,
    reset: resetUsername,
  } = useStringInput("");
  const { value: email, bind: bindEmail, reset: resetEmail } = useStringInput(
    ""
  );
  const {
    value: passwordA,
    bind: bindPasswordA,
    reset: resetPasswordA,
  } = useStringInput("");
  const {
    value: passwordB,
    bind: bindPasswordB,
    reset: resetPasswordB,
  } = useStringInput("");

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
    <div className={classes.root}>
      <div className={classes.content}>
        {(warning && (
          <div>
            <MuiAlert severity="warning">{warning}</MuiAlert>
            <br />
            <span>
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
            </span>
          </div>
        )) ||
          (registered && (
            <div>
              <MuiAlert severity="success">Registered successfully.</MuiAlert>
              <br />
              <Typography variant="body1">
                You may now <Link to="/login">login</Link>.
              </Typography>
            </div>
          )) || (
            <div className={classes.content}>
              <Typography variant="h6" color="textSecondary">
                Register
              </Typography>
              <form className={classes.form} onSubmit={handleSubmit}>
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
                <span className={classes.inlineField}>
                  <Button color="primary" onClick={() => history.goBack()}>
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
                </span>
              </form>
            </div>
          )}
      </div>
    </div>
  );
}

export default Register;
