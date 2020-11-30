import * as React from "react";
import { matchPath, useHistory } from "react-router";
import { viewInbox } from "../../controllers/messages";

import {
  Typography,
  makeStyles,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  CircularProgress,
} from "@material-ui/core";

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
    padding: theme.spacing(3),
  },
  drawerContainer: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  card: {
    margin: theme.spacing(3),
    minWidth: 275,
    fontSize: 16,
    color: "red",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: "0px",
  },
  notice: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  hidden: { display: "none" },
}));

function Inbox(props) {
  const classes = useStyles();
  const history = useHistory();
  let [messages, setMessages] = React.useState(null);
  let [senders, setSenders] = React.useState(null);
  const [tabValue, setTabValue] = React.useState("loading");

  React.useEffect(() => {
    let credentials = props.credentials,
      { token } = credentials || {};

    async function init() {
      try {
        if (credentials) setMessages(await viewInbox(token));
      } catch (error) {
        if (error.message.match(/NetworkError/g)) setTabValue("noservice");
        else setTabValue("error");
      }
    }
    init();
  }, [props.credentials]);

  React.useEffect(() => {
    if (messages) setSenders(Object.keys(messages));
  }, [messages]);

  React.useEffect(() => {
    if (!senders) return;

    if (!senders.length) setTabValue("empty");
    else if (["empty", "loading"].includes(tabValue)) setTabValue("init");
  }, [senders, tabValue]);

  React.useEffect(() => {
    let location = matchPath(history.location.pathname, {
      path: "/messages/:user",
      strict: false,
      exact: true,
    });

    let uriParam = location && location.params.user;

    if (!uriParam) return;
    if (senders && !senders.includes(uriParam)) return setTabValue("error");

    setTabValue(uriParam);
  }, [history.location.pathname, senders, messages]);

  const handleChange = (event, newValue) => {
    history.push(`/messages/${newValue}`);
  };

  return (
    <>
      {props.credentials && (
        <div className={classes.root}>
          <div>
            <div className={classes.actions}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => history.push("/message/new")}>
                New message
              </Button>
              <Button
                variant="outlined"
                onClick={() => history.push("/dashboard")}>
                Back
              </Button>
            </div>
            <div>
              <br />
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleChange}>
                {senders &&
                  senders.map((sender, i) => {
                    return (
                      <Tab
                        key={i}
                        value={sender}
                        label={sender}
                        id={`tab-${i}`}></Tab>
                    );
                  })}
                <Tab
                  className={classes.hidden}
                  key="loading"
                  value="loading"></Tab>
                <Tab
                  className={classes.hidden}
                  hidden={true}
                  key="init"
                  value="init"></Tab>
                <Tab className={classes.hidden} key="empty" value="empty"></Tab>
                <Tab className={classes.hidden} key="error" value="error"></Tab>
              </Tabs>
            </div>
          </div>
          <main className={classes.content}>
            {senders &&
              senders.map((sender, i) => {
                return (
                  <TabPanel value={tabValue} index={sender} key={i}>
                    <Typography variant="h6" color="textSecondary">
                      {`Inbox﹥`}
                      {sender.replace(/^(\w)/g, (c) => c.toUpperCase())}
                    </Typography>
                    {messages[sender].map((message, i) => (
                      <Message key={i} message={message} />
                    ))}
                  </TabPanel>
                );
              })}
            <TabPanel value={tabValue} index="loading">
              <Typography
                className={classes.notice}
                variant="h6"
                color="textSecondary">
                Loading...
                <br />
                <CircularProgress />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index="init">
              <Typography
                className={classes.notice}
                variant="h6"
                color="textSecondary">
                No thread selected
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index="empty">
              <Typography
                className={classes.notice}
                variant="h6"
                color="textSecondary">
                {props.location && `Your Inbox is empty`}
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index="error">
              <Typography
                className={classes.notice}
                variant="h6"
                color="textSecondary">
                {(props.location &&
                  `No thread found for '${
                    matchPath(props.location.pathname, {
                      path: "/messages/:thread",
                      exact: true,
                      strict: false,
                    })?.params?.thread
                  }'`) ||
                  "nothing"}
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index="noservice">
              <Typography
                className={classes.notice}
                variant="h6"
                color="textSecondary">
                Service unavailable
              </Typography>
            </TabPanel>
          </main>
        </div>
      )}
    </>
  );
}

function Message(props) {
  const {
    message: { sender, recipient, subject, body, footer },
  } = props;
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          <b>From: </b>
          {sender}
          <br />
          <b>To: </b>
          {recipient}
        </Typography>

        <Typography variant="body1" color="textPrimary">
          <b>Subject: </b>
          {subject}
          <br />
          {body}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          {footer}
        </Typography>
      </CardContent>
    </Card>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contacts-tabpanel-${index}`}
      aria-labelledby={`contacts-tab-${index}`}
      {...other}>
      {value === index && <>{children}</>}
    </div>
  );
}

export default Inbox;
