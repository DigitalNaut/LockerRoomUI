import * as React from "react";
import { Link } from "react-router-dom";

import styles from "./Dashboard.module.scss";

import { MenuItem, MenuList, Typography } from "@material-ui/core";

function Dashboard(props) {
  return (
    <div>
      {(props.credentials && (
        <>
          <MenuList>
            <MenuItem>
              <Link to="/messages">View your inbox</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/message/new">Send a message</Link>
            </MenuItem>
            <MenuItem>Raise a new petition</MenuItem>
            <MenuItem>Respond to an event</MenuItem>
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
