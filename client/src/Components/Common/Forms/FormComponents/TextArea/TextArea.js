import React from "react";
import PropTypes from "prop-types";
// import "../../../../../css/bulma.css";
const TextArea = (props) => (
  <div>
    <label className="label">{props.title}</label>
    <textarea
      className="input"
      name={props.name}
      value={props.content}
      onChange={props.controlFunc}
      placeholder={props.placeholder}
      required={props.isRequired}
    />
  </div>
);

TextArea.propTypes ={
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool
};

export default TextArea;
