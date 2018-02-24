import React from "react";
import PropTypes from "prop-types";
import "./HTMLMarkupContainer.css";
const HTMLMarkupContainer = (props) => {
  const html = {__html: props.content};
  const partContainer = <div dangerouslySetInnerHTML={html} />;
  return (
    <div >
      {partContainer}
    </div>
  );
};

HTMLMarkupContainer.propTypes = {
  content: PropTypes.string.isRequired
};

export default HTMLMarkupContainer;
