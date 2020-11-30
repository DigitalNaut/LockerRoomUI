import * as React from "react";
import { Link } from "react-router-dom";

import styles from "./Dashboard.module.scss";

import { MenuItem, MenuList, Typography } from "@material-ui/core";

function Dashboard(props) {
  return (
    <div>
      <Typography variant="h6" color="textSecondary">
        {"Dashboard"}
      </Typography>
      {(props.credentials && (
        <>
          <MenuList>
            <Link to="/messages">
              <MenuItem>View your Inbox</MenuItem>
            </Link>
            <Link to="/message/new">
              <MenuItem>Send a message</MenuItem>
            </Link>
            <Link to="/event/new">
              <MenuItem>Create an Event</MenuItem>
            </Link>
            <MenuItem>Raise a New Petition</MenuItem>
            <MenuItem>Respond to an Event</MenuItem>
          </MenuList>
        </>
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
