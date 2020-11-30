import * as React from "react";
import {
  useStringInput,
  useBoolInput,
  useNullableInput,
} from "../../controllers/hooks/useInput";
import { createEvent } from "../../controllers/events";

import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  makeStyles,
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
    ["& > :not(:last-child)"]: {
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
}));

function EventCreator(props) {
  const classes = useStyles();
  let [sendResult, setSendResult] = React.useState(null);
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
    value: msgUserFilter,
    bind: bindUserFilter,
    reset: resetUserFilter,
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
  } = useNullableInput(null);
  let {
    value: msgTemplate,
    bind: bindTemplate,
    reset: resetTemplate,
  } = useStringInput("");

  function handleDismissAlert(event) {
    event.preventDefault();

    setSendResult(null);
  }

  function handleSendAnother(event) {
    resetTitle();
    resetAbout();
    resetType();
    resetCode();
    resetUserFilter();
    resetMandatory();
    resetExpDate();
    resetTemplate();

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
      userFilter: msgUserFilter,
      mandatory: Boolean(msgMandatory),
      expDate: msgExpDate,
      template: msgTemplate,
    };

    console.log("Event:", event);

    let alertTemplate = "The event requires a ";
    if (!event.title) return setAlert(`${alertTemplate}title.`);
    if (!event.type) return setAlert(`${alertTemplate}type.`);
    if (!event.code) return setAlert(`${alertTemplate}code.`);

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
              <Divider />
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
              <CountedTextField
                label="User Filter"
                multiline
                rows={4}
                binder={bindUserFilter}
                charLimit={255}
              />

              <CountedTextField
                label="Petition template"
                multiline
                rows={8}
                binder={bindTemplate}
                charLimit={255}
              />

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
