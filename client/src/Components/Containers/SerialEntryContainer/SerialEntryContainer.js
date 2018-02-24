import React from "react";
import PropTypes from "prop-types";
import {
  withRouter
} from "react-router-dom";
import "./SerialEntryContainer.css";
const SerialEntryContainer = (props) => {
  return (
    <div className="entry-container">
      <h2>{props.serial.title}</h2>
      <p>{props.serial.synopsis}</p>
      <div className="level is-mobile">
        <div className="level-left">
          <button className="button is-primary level-item" onClick={()=>{
            const location = {
              pathname: props.serialUri
            };
            props.history.push(location);
          }}>Read it</button>
          <button className="button is-disabled level-item">Subscribe</button>
        </div>

      </div>
    </div>
  );
};

SerialEntryContainer.propTypes = {
  serial: PropTypes.object.isRequired,
  serialUri: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(SerialEntryContainer);
