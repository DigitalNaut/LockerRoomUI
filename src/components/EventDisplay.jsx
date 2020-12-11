import * as React from "react";
import { useStringInput } from "../controllers/hooks/useInput";
import { DateTime } from "luxon";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { participateEvent, getPetitionForEvent } from "../controllers/events";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(1),
    minWidth: 275,
    fontSize: 16,
  },
  label: {
    margin: 10,
  },
  field: {
    minWidth: 350,
  }
}));

export default function Event(props) {
  const classes = useStyles();
  let [sendResult, setSendResult] = React.useState(null);
  let [petition, setPetition] = React.useState(null);
  let { expanded, condensed } = props;
  let {
    value: enclosure,
    bind: bindEnclosure,
    reset: resetEnclosure,
  } = useStringInput("");
  let { title, about, template, expDate, id } = props.event;

  React.useEffect(async () => {
    if (!condensed) setPetition(await getPetitionForEvent(id));
  }, [id, condensed]);

  if (template) template = JSON.parse(template);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      let response = await participateEvent(id, enclosure);
      console.log("response:", response);
      if (!response) return null;
      setSendResult(response);
      setPetition(response);
    } catch (error) {
      setSendResult(error);
    }
  }

  return (
    <>
      {sendResult && (
        <>
          {!sendResult.message && (
            <MuiAlert severity="success">Response sent successfully.</MuiAlert>
          )}
          {sendResult.message && (
            <MuiAlert severity="warning">{sendResult.message}</MuiAlert>
          )}
        </>
      )}
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4">{title}</Typography>
          {expDate && (
            <Typography className={classes.date} color="textSecondary">
              Deadline:{" "}
              {DateTime.fromISO(expDate).setLocale("en-US").toLocaleString({
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          )}
          <br />
          <Typography>{about}</Typography>
          <br />
          {!condensed && petition && (
            <>
              {petition.enclosure && (
                <Typography>Your response: {petition.enclosure}</Typography>
              )}
              <Typography>Status: {petition.result}</Typography>
              {petition.resultMessage && (
                <Typography>Message: {petition.resultMessage}</Typography>
              )}
            </>
          )}
          {expanded && (
            <>
              {!petition && (
                <form onSubmit={handleSubmit}>
                  {template && template.type === "text" && (
                    <>
                      <TextField
                        label={template.label}
                        className={classes.field}
                        {...bindEnclosure}
                        required
                      />
                      <br />
                    </>
                  )}
                  {template && template.type === "select" && (
                    <>
                      <FormControl className={classes.label}>
                        <InputLabel>{template.label}</InputLabel>
                        <Select className={classes.field} {...bindEnclosure} required>
                          {template.options.split(",").map((option) => {
                            return <MenuItem value={option}>{option}</MenuItem>;
                          })}
                        </Select>
                      </FormControl>
                      <br />
                    </>
                  )}
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    onSubmit={handleSubmit}>
                    Participate
                  </Button>
                </form>
              )}
            </>
          )}
          {condensed && props.children}
        </CardContent>
      </Card>
    </>
  );
}
