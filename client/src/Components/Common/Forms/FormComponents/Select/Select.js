import React from "react";
import PropTypes from "prop-types";

const Select = props => (
  <div>
    <label className="label">{props.title}</label>
    <select
      className="input"
      name={props.name}
      onChange={props.controlFunc}
      required={props.isRequired}>
      <option value="">{props.defaultOption}</option>
      {props.options.map(option => {
        return (
          <option key={option._id} value={option.name}>
            {option.name}
          </option>
        );
      })}
    </select>
  </div>
);

Select.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func.isRequired,
  defaultOption: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool
};

export default Select;
