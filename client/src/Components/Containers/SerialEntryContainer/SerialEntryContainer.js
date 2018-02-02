import React from "react";
import PropTypes from "prop-types";

const SerialEntryContainer = (props) => {
  return (
    <div>
      <h2>{props.serial.title}</h2>
      <p>{props.serial.synopsis}</p>
      <div>
        <button onClick={props.goToSerial}>Read it</button>
        <button>Subscribe</button>
      </div>
    </div>
  );
};

SerialEntryContainer.propTypes = {
  serial: PropTypes.object.isRequired,
  goToSerial: PropTypes.func.isRequired
};

export default SerialEntryContainer;
