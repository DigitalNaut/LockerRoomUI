import logo from "./logo.svg";
import style from "./App.module.scss";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import * as React from "react";

import ComingSoon from "./views/ComingSoon";
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

function App(props) {
  let [activeLogin, setActiveLogin] = React.useState(null);

  React.useEffect(() => {
    let credentials = loadCredentials();
    let { username, token, role } = credentials || {};

    if (username && token) {
      setActiveLogin({ username, token, role });
    }
  }, []);

  return (
    <div className={style.app}>
      <Router>
        <Header credentials={activeLogin} />
        <Switch>
          <Route exact path="/">
            <Homepage credentials={activeLogin} />
          </Route>
          <Route exact path="/register">
            <Register credentials={activeLogin} />
          </Route>
          <Route exact path="/login">
            <Login credentials={activeLogin} setActiveLogin={setActiveLogin} />
          </Route>
          <Route exact path="/logout">
            <Logout credentials={activeLogin} setActiveLogin={setActiveLogin} />
          </Route>
          <Route path="/dashboard">
            <Dashboard credentials={activeLogin} />
          </Route>
          <Route path="/lockers">
            <ComingSoon credentials={activeLogin} />
          </Route>
          <Route path="/messages">
            <Inbox credentials={activeLogin} />
          </Route>
          <Route path="/message/new">
            <Compose credentials={activeLogin} />
          </Route>
          <Route path="/message/view">
            <ComingSoon credentials={activeLogin} />
          </Route>
          <Route path="/users">
            <ComingSoon credentials={activeLogin} />
          </Route>
          <Route path="/users/:username">
            <ComingSoon credentials={activeLogin} />
          </Route>

          <Route component={NotFound}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
