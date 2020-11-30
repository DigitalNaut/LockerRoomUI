import * as React from "react";
import { useStringInput } from "../../controllers/hooks/useInput";
import { login, saveCredentials } from "../../controllers/auth";
import { Redirect, useHistory } from "react-router-dom";

import {
  makeStyles,
  TextField,
  Button,
  Snackbar,
  Divider,
  Typography,
} from "@material-ui/core";
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
}));

function Login(props) {
  const classes = useStyles();
  let redirectDelay = 800;
  const history = useHistory();

  const {
    value: username,
    bind: bindUsername,
    reset: resetUsername,
  } = useStringInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useStringInput("");

  const [warning, setWarning] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const handleOpen = () => {
    setSuccess(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setWarning("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setWarning("");

    let credentials = {
      username: username,
      password: password,
    };

    let response = await login(credentials);
    if (!response) return setWarning("Could not log you in.");

    let { token, role, message } = response || {};

    // console.log("Login Response:", response);

    if (!credentials.username || !token)
      return setWarning(message ? message : "Error signing you in.");

    let savedCredentials = JSON.parse(
      saveCredentials({ username, token, role })
    );

    if (!savedCredentials)
      setWarning(message ? message : "Could not store your session.");

    handleOpen();

    setTimeout(() => props.setActiveLogin(savedCredentials), redirectDelay);

    resetUsername();
    resetPassword();
  };

  return (
    <div className={classes.root}>
      {props.credentials && <Redirect push to="/dashboard" />}
      {
        <>
          <Snackbar
            open={warning || success ? true : false}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={redirectDelay}
            onClose={handleClose}>
            <div>
              {warning && <MuiAlert severity="warning">{warning}</MuiAlert>}{" "}
              {success && (
                <MuiAlert onClose={handleClose} severity="success">
                  Signed in successfully!
                </MuiAlert>
              )}
            </div>
          </Snackbar>
        </>
      }
      <div className={classes.content}>
        {!props.credentials && (
          <>
            <form
              className={classes.form}
              autoComplete="off"
              onSubmit={handleSubmit}>
              <Typography variant="h6" color="textSecondary">
                Login
              </Typography>
              <TextField
                required
                id="standard-basic"
                label="Username"
                autoFocus={true}
                {...bindUsername}
              />
              <br />
              <TextField
                required
                id="standard-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                {...bindPassword}
              />
              <br />
              <span>
                <span className={classes.inlineField}>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => history.push("/")}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    name="submit"
                    type="submit"
                    color="primary"
                    onSubmit={handleSubmit}>
                    Submit
                  </Button>
                </span>
                <Button
                  name="register"
                  type="button"
                  color="primary"
                  onClick={() => history.push("/register")}>
                  Register
                </Button>
              </span>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
