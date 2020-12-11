import * as React from "react";
import { Link, useHistory } from "react-router-dom";

import {
  Button,
  makeStyles,
  MenuItem,
  MenuList,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  item: {
    margin: "5px"
  }
}));

function Dashboard(props) {
  let classes = useStyles();
  const history = useHistory();

  return (
    <div>
      <Typography variant="h6" color="textSecondary">
        {"Dashboard"}
      </Typography>
      {(props.credentials && (
        <div className={classes.root}>
          <MenuList>
            <Button
              className={classes.item}
              variant="contained"
              color="primary"
              onClick={() => history.push("/messages")}>
              <MenuItem>View your Inbox</MenuItem>
            </Button>
            <Button
              className={classes.item}
              variant="contained"
              color="primary"
              onClick={() => history.push("/message/new")}>
              <MenuItem>Send a message</MenuItem>
            </Button>
            <br/>
            <Button
              className={classes.item}
              variant="contained"
              color="primary"
              onClick={() => history.push("/events")}>
              <MenuItem>View Current Events</MenuItem>
            </Button>
            {props.credentials.role === "admin" && (
              <>
                <Button
                  className={classes.item}
                  variant="contained"
                  color="primary"
                  onClick={() => history.push("/event/new")}>
                  <MenuItem>Create an Event</MenuItem>
                </Button>
                <Button
                  className={classes.item}
                  variant="contained"
                  color="primary"
                  onClick={() => history.push("/petitions")}>
                  <MenuItem>Event Petitions</MenuItem>
                </Button>
              </>
            )}
          </MenuList>
        </div>
      )) || (
        <>
          <Typography variant="h5">Session not started.</Typography>
          <Typography variant="h6">
            Please <Link to="/login">sign in</Link>.
          </Typography>
        </>
      )}
    </div>
  );
}

export default Dashboard;
