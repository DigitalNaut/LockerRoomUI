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
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },

    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
    <Container maxWidth="lg">
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Header credentials={activeLogin} />
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="app header" />
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
                  console.log("RESETTING");
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
              {/* <Route path="/lockers">
                <ComingSoon credentials={activeLogin} />
              </Route> */}
              <Route path="/messages">
                <Inbox credentials={activeLogin} />
              </Route>
              <Route path="/message/new">
                <Compose credentials={activeLogin} />
              </Route>
              {/* <Route path="/message/view">
                <ComingSoon credentials={activeLogin} />
              </Route>
              <Route path="/users">
                <ComingSoon credentials={activeLogin} />
              </Route>
              <Route path="/users/:username">
                <ComingSoon credentials={activeLogin} />
              </Route> */}

              <Route component={NotFound}></Route>
            </Switch>
          </main>
        </div>
      </Router>
    </Container>
  );
}

export default App;
