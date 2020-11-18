import logo from "./logo.svg";
import "./App.module.scss";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import ComingSoon from "./views/ComingSoon";
import Dashboard from "./views/dashboard/Dashboard";
import Homepage from "./views/Homepage";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";

import NotFound from "./views/error/NotFound";
import Compose from "./views/messages/Compose";
import Inbox from "./views/messages/Inbox";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/logout" component={Logout}></Route>
        <Route path="/dashboard" component={Dashboard}></Route>
        <Route path="/lockers" component={ComingSoon}></Route>
        <Route path="/messages" component={Inbox}></Route>
        <Route path="/message/new" component={Compose}></Route>
        <Route path="/message/view" component={ComingSoon}></Route>
        <Route path="/users" component={ComingSoon}></Route>
        <Route path="/users/:username" component={ComingSoon}></Route>

        <Route component={NotFound}></Route>
      </Switch>
    </Router>
  );
}

export default App;
