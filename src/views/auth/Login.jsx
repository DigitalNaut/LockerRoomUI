import * as React from "react";
import { useInput } from "../../controllers/hooks/useInput";
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

import styles from "./Login.module.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: "380px",
    ["& > *"]: {
      flexGrow: 1,
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
  } = useInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput("");

  let [warning, setWarning] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      {
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={redirectDelay}
          onClose={handleClose}>
          <MuiAlert onClose={handleClose} severity="success">
            Signed in successfully!
          </MuiAlert>
        </Snackbar>
      }
      {props.credentials && <Redirect push to="/dashboard" />}
      {!props.credentials && (
        <div>
          <form
            className={classes.content}
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
            <div>
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
              <Divider />
              <Button
                name="register"
                type="button"
                color="primary"
                onClick={() => history.push("/register")}>
                Register
              </Button>
            </div>
          </form>
        </div>
      )}
      {warning && <MuiAlert severity="warning">{warning}</MuiAlert>}
    </div>
  );
}

export default Login;
