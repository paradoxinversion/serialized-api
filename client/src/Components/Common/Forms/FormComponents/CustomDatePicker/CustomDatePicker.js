import React from "react";
import PropTypes from "prop-types";
const DatePicker = props => (
  <div>
    <label className="label">{props.title}</label>
    <input
      className="input"
      name={props.name}
      type=""
      value={props.date}
      onChange={props.controlFunc}
      required={props.required}
      min={props.min}
      max={props.max}
    />
  </div>
);

DatePicker.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  required: PropTypes.bool
};

export default DatePicker;
