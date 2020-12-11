import * as React from "react";

import { Typography, Card, CardContent, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(3),
    minWidth: 275,
    fontSize: 16,
  },
}));

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

export default Message;
