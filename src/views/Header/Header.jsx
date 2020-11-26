import { Button, makeStyles, Typography } from "@material-ui/core";
import * as React from "react";
import { useHistory } from "react-router-dom";

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

  function toFirstCase(string) {
    return string.replace(/^(\w)/g, (c) => c.toUpperCase());
  }

  return (
    <>
      {(props.credentials && (
        <>
          <Button
            color="inherit"
            size="small"
            onClick={() => history.push("/dashboard")}>
            Dashboard
          </Button>
          <Typography variant="h6">
            {`Hello, ${toFirstCase(role)} ${toFirstCase(username)}`}
          </Typography>
          <Button
            color="inherit"
            size="small"
            onClick={() => history.push("/logout")}>
            Logout
          </Button>
        </>
      )) || (
        <>
          <Button
            color="inherit"
            size="small"
            onClick={() => history.push("/")}>
            Home
          </Button>
          <Typography variant="h4">LOKR</Typography>
          <Button
            color="inherit"
            variant="outlined"
            size="small"
            onClick={() => history.push("/login")}>
            Login
          </Button>
        </>
      )}
    </>
  );
}

export default Header;
