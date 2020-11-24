import { Button } from "@material-ui/core";
import * as React from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "./Header.module.scss";

function Header(props) {
  const history = useHistory();
  let [username, setUsername] = React.useState("");
  let [role, setRole] = React.useState("");

  React.useLayoutEffect(() => {
    if (props.credentials) {
      setUsername(props.credentials.username);
      setRole(props.credentials.role);
    }
  }, [props.credentials]);

  return (
    <div className={styles.component}>
      {props.credentials && (
        <div>
          Hello, {role} {username}.
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={() => history.push("/logout")}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}

export default Header;
