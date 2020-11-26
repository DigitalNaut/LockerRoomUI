import * as React from "react";
import { Link, useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";

import styles from "./Homepage.module.scss";
import { Divider, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

function Homepage(props) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <div>
        <Typography variant="h4">Welcome</Typography>
        <Divider />
        {(props.credentials && (
          <Button onClick={() => history.push("/dashboard")}>Dashboard</Button>
        )) || (
          <div>
            <Button color="primary" onClick={() => history.push("/register")}>
              Register
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => history.push("/login")}>
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
