import React from "react";
import PropTypes from "prop-types";
import "./InputField.css";
const InputField = props => (
  <React.Fragment>
    {props.title ? (
      <label className="label" htmlFor={props.name}>
        {props.title}
      </label>
    ) : null}
    <input
      className="input"
      name={props.name}
      type={props.inputType}
      value={props.content}
      onChange={props.controlFunc}
      placeholder={props.placeholder}
      required={props.isRequired}
      onBlur={props.blurFunc}
      minLength={props.minLength}
      maxLength={props.maxLength}
      min={props.min}
      max={props.max}
    />
  </React.Fragment>
);

InputField.defaultProps = {
  blurFunc: null,
  minLength: 1,
  maxLength: 500
};

InputField.propTypes = {
  inputType: PropTypes.oneOf(["text", "number", "password", "email"])
    .isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func.isRequired,
  blurFunc: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  minLength: PropTypes.number,
  maxLength: PropTypes.number
};

export default InputField;
