import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "./HTMLMarkupContainer.css";
const HTMLMarkupContainer = props => {
  const html = { __html: props.content };
  const partContainer = (
    <div className="text-content" dangerouslySetInnerHTML={html} />
  );
  return <Fragment className="container">{partContainer}</Fragment>;
};

HTMLMarkupContainer.propTypes = {
  content: PropTypes.string.isRequired
};

export default HTMLMarkupContainer;
