import React from "react";
import PropTypes from "prop-types";

const SerialPartsCounter = (props) => {
  return <p>{props.serialParts} Parts </p>;
};

SerialPartsCounter.propTypes = {
  serialParts: PropTypes.number
};

export default SerialPartsCounter;
