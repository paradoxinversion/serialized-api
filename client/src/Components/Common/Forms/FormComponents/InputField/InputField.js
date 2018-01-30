import React from "react";
import PropTypes from "prop-types";
import "../../../../../css/bulma.css";
const InputField = (props) => (
  <div>
    <label className="label">{props.title}</label>
    <input
      className="input"
      name={props.name}
      type={props.inputType}
      value={props.content}
      onChange={props.controlFunc}
      placeholder={props.placeholder}
      required={props.isRequired}
    />
  </div>
);

InputField.propTypes ={
  inputType: PropTypes.oneOf(["text", "number", "password", "email"]).isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func.isRequired,
  content: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]).isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool
};

export default InputField;
