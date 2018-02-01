import React from "react";
import {withRouter} from "react-router-dom";

const NotFound = ({location}) => {
  return (
    <h1> {location.pathname} was not found.</h1>
  )
};

export default NotFound;
