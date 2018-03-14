import React from "react";
import PropTypes from "prop-types";

const LikeCounter = (props) => {
  return (
    <p>Liked by {props.totalLikes}</p>
  );
};

LikeCounter.propTypes = {
  totalLikes: PropTypes.number.isRequired
};

export default LikeCounter;
