import logo from "./logo.svg";

import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import * as React from "react";

import {
  AppBar,
  Container,
  CssBaseline,
  makeStyles,
  Toolbar,
  IconButton,
} from "@material-ui/core";

import Dashboard from "./views/dashboard/Dashboard";
import Homepage from "./views/Homepage";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";

import Header from "./views/Header/Header";
import NotFound from "./views/error/NotFound";
import Compose from "./views/messages/Compose";
import Inbox from "./views/messages/Inbox";
import { loadCredentials } from "./controllers/auth";

const drawerWidth = 0;

const useStyles = makeStyles((theme) => ({
  root: {},
  appBar: {
    [theme.breakpoints.up("sm")]: {},
    zIndex: theme.zIndex.drawer + 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  headerBar: {
    display: "flex",
    flexDirection: "row",
    width: "inherit",
    justifyContent: "space-around",
    maxWidth: "80vw",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(6),
  },
}));

function App(props) {
  let [activeLogin, setActiveLogin] = React.useState(null);
  let [failedAuthentication, setFailedAuthentication] = React.useState(false);

  let classes = useStyles();

  React.useLayoutEffect(() => {
    let credentials = loadCredentials();

    if (!credentials) {
      console.log("Failed authentication");

      setFailedAuthentication(true);
    }

    let { username, token, role } = credentials || {};

    if (username && token) {
      setActiveLogin({ username, token, role });
    }
  }, []);

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Router>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar className={classes.headerBar}>
            <Header credentials={activeLogin} />
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <Toolbar />
          <Switch>
            <Route exact path="/">
              <Homepage credentials={activeLogin} />
            </Route>
            <Route exact path="/register">
              <Register credentials={activeLogin} />
            </Route>
            <Route
              exact
              path="/login"
              render={() => {
                setFailedAuthentication(false);
              }}>
              <Login
                credentials={activeLogin}
                setActiveLogin={setActiveLogin}
              />
            </Route>
            <Route exact path="/logout">
              <Logout
                credentials={activeLogin}
                setActiveLogin={setActiveLogin}
              />
            </Route>
            {failedAuthentication && !activeLogin && (
              <Redirect push to="/login" />
            )}
            <Route path="/dashboard">
              <Dashboard credentials={activeLogin} />
            </Route>
            <Route
              path="/messages"
              render={(routeProps) => (
                <Inbox credentials={activeLogin} {...routeProps} />
              )}
            />
            <Route
              path="/message/new"
              render={(routeProps) => (
                <Compose credentials={activeLogin} {...routeProps} />
              )}
            />
            <Route component={NotFound}></Route>
          </Switch>
        </main>
      </Router>
    </Container>
  );
}

export default App;
