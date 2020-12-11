import * as React from "react";
import { Link, useHistory } from "react-router-dom";

import { Button, makeStyles, TextField, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import {
  getAllPetitionForEvent,
  viewEventsByUser,
} from "../../controllers/events";
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
}));

function EventPetitions(props) {
  const classes = useStyles();
  const history = useHistory();
  const [events, setEvents] = React.useState([]);
  const [petitions, setPetitions] = React.useState([]);

  React.useEffect(async () => {
    setEvents(await viewEventsByUser());
  }, []);

  React.useEffect(() => {
    if (events) {
      let eventPetitions = events.map(async (event) => {
        let petitions = await getAllPetitionForEvent(event.id);
        return {
          event,
          petitions,
        };
      });
      setPetitions(eventPetitions);
    }
  }, [events]);

  return (
    <div className={classes.root}>
      <div className={classes.actions}>
        {
          <Button variant="outlined" onClick={() => history.push("/dashboard")}>
            Back
          </Button>
        }
      </div>
      <div className={classes.content}>
        {(!events || events.length === 0) && <div>No events</div>}
        {events &&
          events.map((event, index) => {
            return (
              <Event event={event} key={index} condensed={true}>
                <Typography variant="h6">Petitions:</Typography>
                {console.log("Petitions", petitions)}
                {event.petitions &&
                  event.petitions.map((petition, index) => (
                    <div key={index}>
                      <Typography>From: {petition.sender}</Typography>
                    </div>
                  ))}
              </Event>
            );
          })}
      </div>
    </div>
  );
}

export default EventPetitions;
