import React from "react";
import PropTypes from "prop-types";

const HTMLMarkupContainer = (props) => {
  const html = {__html: props.content};
  const partContainer = <div dangerouslySetInnerHTML={html} />;
  return (
    <section className="section">
      {partContainer}
    </section>
  );
};

HTMLMarkupContainer.propTypes = {
  content: PropTypes.string.isRequired
};

export default HTMLMarkupContainer;
