import * as React from "react";
import { Link, useHistory } from "react-router-dom";

import { Button, makeStyles, TextField, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import { viewEventsByType } from "../../controllers/events";
import Event from "../../components/EventDisplay";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    minWidth: "380px",
  },
  clickable: {
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.primary.light,
      color: theme.palette.primary,
    },
  },
}));

function EventsFeed(props) {
  const classes = useStyles();
  const history = useHistory();
  const [events, setEvents] = React.useState();
  const [selectedEvent, setSelectedEvent] = React.useState();

  React.useEffect(async () => {
    setEvents(await viewEventsByType());
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.actions}>
        {!selectedEvent && (
          <Button variant="outlined" onClick={() => history.push("/dashboard")}>
            Back
          </Button>
        )}
        {selectedEvent && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedEvent(null)}>
            Events
          </Button>
        )}
      </div>
      <div className={classes.content}>
        {(!events || events.length === 0) && <div>No events</div>}
        {!selectedEvent &&
          events &&
          events.map((event, index) => {
            return (
              <div
                className={classes.clickable}
                onClick={() => setSelectedEvent(event)}>
                <Event event={event} key={index} />
              </div>
            );
          })}
        {selectedEvent && <Event event={selectedEvent} expanded={true} />}
      </div>
    </div>
  );
}

export default EventsFeed;
