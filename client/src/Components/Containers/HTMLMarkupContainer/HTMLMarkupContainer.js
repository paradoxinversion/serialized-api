import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "./HTMLMarkupContainer.css";
const HTMLMarkupContainer = props => {
  const html = { __html: props.content };
  const divClass = props.isStoryContent ? "story-content" : "text-content";
  const partContainer = (
    <div className={divClass} dangerouslySetInnerHTML={html} />
  );
  return <Fragment>{partContainer}</Fragment>;
};

HTMLMarkupContainer.propTypes = {
  content: PropTypes.string.isRequired,
  isStoryContent: PropTypes.bool
};

export default HTMLMarkupContainer;
