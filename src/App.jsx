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
} from "@material-ui/core";

import Dashboard from "./views/dashboard/Dashboard";
import Homepage from "./views/Homepage";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";

import Header from "./views/header/Header";
import NotFound from "./views/error/NotFound";
import Composer from "./views/messages/Composer";
import EventCreator from "./views/events/EventCreator";
import Inbox from "./views/messages/Inbox";
import { loadSession } from "./controllers/auth";
import RouterBreadcrumbs from "./components/RouterBreadcrumbs";

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
    let credentials = loadSession();
    if (credentials) setActiveLogin(credentials);
    else setFailedAuthentication(true);
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
            
            <Route exact path="/test">
              <RouterBreadcrumbs credentials={activeLogin} />
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
                <Composer credentials={activeLogin} {...routeProps} />
              )}
            />
            <Route
              path="/event/new"
              render={(routeProps) => (
                <EventCreator credentials={activeLogin} {...routeProps} />
              )}
            />
            <Route path="/noservice" component={NotFound}></Route>
            <Route component={NotFound}></Route>
          </Switch>
        </main>
      </Router>
    </Container>
  );
}

export default App;
