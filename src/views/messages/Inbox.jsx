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
    justifyContent: "space-around",
  },
  hidden: { display: "none" },
}));

function Inbox(props) {
  const classes = useStyles();
  const history = useHistory();
  let [messages, setMessages] = React.useState([]);
  let [senders, setSenders] = React.useState([]);
  const [tabValue, setTabValue] = React.useState("");

  React.useEffect(() => {
    async function init() {
      if (props.credentials)
        setMessages(await viewInbox(props.credentials.token));
    }
    init();
  }, [props.credentials]);

  React.useEffect(() => {
    if (messages) setSenders(Object.keys(messages));
  }, [messages]);

  React.useEffect(() => {
    let location = matchPath(history.location.pathname, {
      path: "/messages/:user",
      strict: false,
      exact: true,
    });

    let uriParam = location && location.params.user;

    if (!uriParam) return;
    if (!senders.includes(uriParam)) return setTabValue("error");

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
              <Button variant="outlined" onClick={() => history.push("/dashboard")}>
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
                {senders.map((sender, i) => {
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
                  hidden={true}
                  key=""
                  label="Init"
                  value=""></Tab>
                <Tab
                  className={classes.hidden}
                  key="error"
                  label="Error"
                  value="error"></Tab>
              </Tabs>
            </div>
          </div>
          <main className={classes.content}>
            {senders.map((sender, i) => {
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
            <TabPanel value={tabValue} index="">
              <Typography
                className={classes.notice}
                variant="h6"
                color="textSecondary">
                No thread selected
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index="error">
              <Typography
                className={classes.notice}
                variant="h6"
                color="textSecondary">
                {(props.location &&
                  `No thread found for \'${
                    matchPath(props.location.pathname, {
                      path: "/messages/:thread",
                      exact: true,
                      strict: false,
                    })?.params?.thread
                  }\'`) ||
                  "nothing"}
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
