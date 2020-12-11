import * as React from "react";
import { useStringInput, useBoolInput } from "../../controllers/hooks/useInput";
import { createEvent } from "../../controllers/events";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import CountedTextField from "../../components/CountedTextField";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  actions: {},
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    width: "60vw",
    minWidth: "400px",
    maxWidth: "860px",
    ["& > *"]: {
      marginBottom: theme.spacing(1.5),
    },
  },
  evenWidthField: {
    flexShrink: 1,
    flexBasis: "auto",
  },
  halfWidthField: {
    width: "50%",
  },
  threeQuarterField: {
    width: "75%",
  },
  inlineField: {
    display: "flex",
    flexDirection: "row",
    ["& > :not(:last-child)"]: {
      marginRight: "30px",
    },
  },
  label: {
    minWidth: 80,
  },
  field: {
    flexGrow: 1,
    minWidth: 150,
  },
}));

function EventCreator(props) {
  const classes = useStyles();
  let [sendResult, setSendResult] = React.useState(null);
  let [requiredResponseType, setRequiredResponseType] = React.useState("text");
  let [alert, setAlert] = React.useState("");

  let { value: msgTitle, bind: bindTitle, reset: resetTitle } = useStringInput(
    ""
  );
  let { value: msgAbout, bind: bindAbout, reset: resetAbout } = useStringInput(
    ""
  );
  let { value: msgType, bind: bindType, reset: resetType } = useStringInput("");
  let { value: msgCode, bind: bindCode, reset: resetCode } = useStringInput("");
  let {
    value: tmplLabel,
    bind: bindTmplLabel,
    reset: resetTmplLabel,
  } = useStringInput("");
  let {
    value: tmplOptions,
    bind: bindTmplOptions,
    reset: resetTmplOptions,
  } = useStringInput("");
  let {
    checked: msgMandatory,
    bind: bindMandatory,
    reset: resetMandatory,
  } = useBoolInput(false);
  let {
    value: msgExpDate,
    bind: bindExpDate,
    reset: resetExpDate,
  } = useStringInput("");

  let {
    checked: msgNeedsResponse,
    bind: bindNeedsResponse,
    reset: resetNeedsResponse,
  } = useBoolInput(false);

  function handleDismissAlert(event) {
    event.preventDefault();

    setSendResult(null);
  }

  function handleSendAnother(event) {
    resetTitle();
    resetAbout();
    resetType();
    resetCode();
    resetMandatory();
    resetExpDate();
    resetNeedsResponse();
    resetTmplLabel();
    resetTmplOptions();

    setSendResult(null);
  }

  async function handleRetry(event) {
    setAlert("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let event = {
      title: msgTitle,
      about: msgAbout,
      type: msgType,
      code: msgCode,
      userFilter: "",
      mandatory: Boolean(msgMandatory),
      expDate: new Date(msgExpDate),
      template: "",
    };

    if (msgNeedsResponse)
      event.template = JSON.stringify({
        type: requiredResponseType,
        label: tmplLabel,
        options: tmplOptions,
      });

    console.log("Event:", event);

    let alertText = "The event requires a ";
    if (!event.title) return setAlert(`${alertText}title.`);
    if (!event.type) return setAlert(`${alertText}type.`);
    if (!event.code) return setAlert(`${alertText}code.`);

    try {
      let response = await createEvent(Object.values(event));
      if (!response) return null;
      setSendResult(response);
    } catch (error) {
      setAlert(error);
    }
  }

  return (
    <div className={classes.root}>
      {props.credentials && (
        <>
          {sendResult && (
            <>
              {!sendResult.message && (
                <MuiAlert severity="success">
                  Event created successfully.
                </MuiAlert>
              )}
              {sendResult.message && (
                <>
                  <MuiAlert severity="warning">{sendResult.message}</MuiAlert>
                  <br />
                  <Button
                    name="submit"
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleDismissAlert}>
                    Retry
                  </Button>
                </>
              )}
              {!sendResult.message && (
                <label className={classes.actions}>
                  <div>
                    <Button
                      name="sendAnother"
                      type="button"
                      variant="outlined"
                      onClick={handleSendAnother}>
                      Create another
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => props.history.push("/events")}>
                      Events Manager
                    </Button>
                  </div>
                </label>
              )}
            </>
          )}

          {alert && (
            <div>
              <MuiAlert severity="warning">{alert}</MuiAlert>
              <br />
              <Button
                name="submit"
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleRetry}>
                Retry
              </Button>
            </div>
          )}
          {!alert && !sendResult && (
            <form
              onSubmit={handleSubmit}
              validate="true"
              autoComplete="off"
              disabled={sendResult ? true : false}
              className={classes.form}>
              <Typography variant="h6" color="textSecondary">
                {`Events﹥Create`}
              </Typography>
              <CountedTextField
                className={classes.threeQuarterField}
                label="Title"
                required
                binder={bindTitle}
                autoFocus={true}
                charLimit={100}
              />
              <CountedTextField
                label="Event description"
                multiline
                rows={4}
                binder={bindAbout}
                charLimit={255}
              />
              <span className={classes.inlineField}>
                <CountedTextField
                  className={classes.halfWidthField}
                  label="Type"
                  required
                  binder={bindType}
                  charLimit={32}
                />
                <TextField
                  className={classes.evenWidthField}
                  label="Code"
                  type="number"
                  required
                  {...bindCode}
                />
              </span>
              <span className={classes.inlineField}>
                <TextField
                  className={classes.evenWidthField}
                  label="Expiration Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...bindExpDate}
                />
                <FormControlLabel
                  className={classes.evenWidthField}
                  control={
                    <Checkbox
                      name="checkedMandatory"
                      color="primary"
                      {...bindMandatory}
                    />
                  }
                  label="Mandatory"
                />
              </span>

              <FormControlLabel
                className={classes.evenWidthField}
                control={
                  <Checkbox
                    name="responseRequired"
                    color="primary"
                    {...bindNeedsResponse}
                  />
                }
                label="Response required"
              />

              {msgNeedsResponse && (
                <div className={classes.inlineField}>
                  <FormControl className={classes.label}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={requiredResponseType}
                      onChange={(event) => {
                        setRequiredResponseType(event.target.value);
                      }}>
                      <MenuItem value={"text"}>Text</MenuItem>
                      <MenuItem value={"select"}>Selection</MenuItem>
                    </Select>
                  </FormControl>
                  {requiredResponseType && (
                    <TextField
                      label="Label"
                      className={classes.field}
                      {...bindTmplLabel}
                      required
                    />
                  )}
                  {requiredResponseType === "select" && (
                    <TextField
                      label="Options"
                      className={classes.field}
                      {...bindTmplOptions}
                      required
                    />
                  )}
                </div>
              )}

              <label>
                <Button
                  variant="outlined"
                  onClick={() => props.history.goBack()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onSubmit={handleSubmit}>
                  Create
                </Button>
              </label>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default EventCreator;
