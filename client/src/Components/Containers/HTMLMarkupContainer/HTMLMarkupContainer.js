import React from "react";
import PropTypes from "prop-types";
import "./HTMLMarkupContainer.css";
const HTMLMarkupContainer = (props) => {
  const html = {__html: props.content};
  const partContainer = <div className="text-content" dangerouslySetInnerHTML={html} />;
  return (
    <div className="container container--centered">
      {partContainer}
    </div>
  );
};

HTMLMarkupContainer.propTypes = {
  content: PropTypes.string.isRequired
};

export default HTMLMarkupContainer;
