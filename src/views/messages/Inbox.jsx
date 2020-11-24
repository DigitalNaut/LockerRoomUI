import * as React from "react";
import { useHistory } from "react-router";
import { viewInbox } from "../../controllers/messages";

import {
  Container,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  makeStyles,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

// import styles from "./Inbox.module.scss";
import { Link, Redirect } from "react-router-dom";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    alignItems: "center",
  },
  drawerContainer: {
    overflow: "auto",
  },
  card: {
    margin: "10px 0px",
    minWidth: 275,
    fontSize: 16,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Inbox(props) {
  const history = useHistory();
  let [messages, setMessages] = React.useState([]);
  let [senders, setSenders] = React.useState([]);
  let [thread, setThread] = React.useState([]);

  const classes = useStyles();

  function onSelectThread(sender) {
    setThread(messages[sender]);
  }

  React.useLayoutEffect(() => {
    if (messages) setSenders(Object.keys(messages));
  }, [messages]);

  React.useLayoutEffect(() => {
    async function init() {
      if (props.credentials)
        setMessages(await viewInbox(props.credentials.token));
    }
    init();
  }, [props.credentials]);

  return (
    <>
      {props.credentials && (
        <div className={classes.root}>
          <CssBaseline />
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{ paper: classes.drawerPaper }}>
            <Toolbar />
            <div className={classes.drawerContainer}>
              <Button onClick={() => history.push("/dashboard")}>
                Dashboard
              </Button>
              <br />
              <Button
                color="primary"
                variant="contained"
                onClick={() => history.push("/message/new")}>
                New message
              </Button>
              <Divider />
              <MenuList>
                {senders.map((sender, i) => {
                  return (
                    <MenuItem
                      key={i}
                      className={classes.menuItem}
                      onClick={(event) => onSelectThread(sender)}>
                      {sender}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </div>
          </Drawer>
          <main className={classes.content}>
            {thread.map((message, i) => {
              return (
                <Card key={i} className={classes.card}>
                  <CardContent>
                    <Typography
                      className={classes.pos}
                      color="textSecondary"
                      gutterBottom>
                      <b>From: </b>
                      {message.sender}
                      <br />
                      <b>To: </b>
                      {message.recipient}
                    </Typography>
                    <Typography
                      variant="body1"
                      className={classes.pos}
                      color="textPrimary">
                      <b>Subject: </b>
                      {message.subject}
                      <br />
                      {message.body}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={classes.pos}
                      color="textSecondary">
                      <p>{message.footer}</p>
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
            {((!senders || !senders.length) && (
              <Typography variant="h6" color="textSecondary">
                Your inbox is empty.
              </Typography>
            )) ||
              ((!thread || !thread.length) && (
                <Typography variant="h6" color="textSecondary">
                  No conversation selected.
                </Typography>
              ))}
          </main>
        </div>
      )}
    </>
  );
}

export default Inbox;
