import React from "react";
import PropTypes from "prop-types";

const NotFound = ({location}) => {
  return (
    <h1> {location.pathname} was not found.</h1>
  );
};

NotFound.propTypes = {
  location: PropTypes.object.isRequired
};

export default NotFound;
