import { Link } from "react-router-dom";

import styles from "./NotFound.module.scss";

function NotFound(props) {
  return (
    <>
      <h1>404: Not found</h1>
      <p>
        <Link to="/">Return home</Link>
      </p>
    </>
  );
}

export default NotFound;
