import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./SerialStepper.css";
const SerialStepper = props => {
  if (props.currentPart) {
    return (
      <div className="serial-stepper">
        {props.currentPart.part_number !== 0 ? (
          <React.Fragment>
            <Link
              className="button serial-stepper__step"
              to={`${
                props.serialParts[props.currentPart.part_number - 1]._id
              }`}>
              {" "}
              Previous
            </Link>
          </React.Fragment>
        ) : null}
        {props.currentPart.part_number < props.serialParts.length - 1 ? (
          <React.Fragment>
            <Link
              className="button serial-stepper__step"
              to={`${
                props.serialParts[props.currentPart.part_number + 1]._id
              }`}>
              {" "}
              Next
            </Link>
          </React.Fragment>
        ) : null}
      </div>
    );
  } else {
    return null;
  }
};

SerialStepper.propTypes = {
  currentPart: PropTypes.object,
  serialParts: PropTypes.object
};
export default SerialStepper;
