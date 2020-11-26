import { Button, Divider, makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    display: "flex",
    flexDirection: "column",

    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(3),
  },
}));

function NotFound(props) {
  const history = useHistory();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <span className={classes.content}>
        <Typography variant="h4">404: Not found</Typography>
        <Divider />
        <Typography variant="h5">{`You're drunk,`}</Typography>
        <span>
          <Button type="button" onClick={() => history.goBack()}>
            Go big
          </Button>
          {` or `}
          <Button type="button" onClick={() => history.push("/")}>
            Go Home
          </Button>
        </span>
      </span>
    </div>
  );
}

export default NotFound;
