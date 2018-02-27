import React from "react";
import PropTypes from "prop-types";
import {
  Link
} from "react-router-dom";
const SerialStepper = (props)=> {
  let previous;
  let next;
  if (props.currentPart){
    if (props.currentPart.part_number !== 0){
      previous = (
        <Link to={`${props.serialParts[props.currentPart.part_number-1]._id}`}> Previous</Link>
      )
    }
    if (props.currentPart.part_number < props.serialParts.length-1){
      console.log(props.serialParts[props.currentPart.part_number+1]);
      next = (
        <Link to={`${props.serialParts[props.currentPart.part_number+1]._id}`}> Next</Link>
      )
    }
    return (

      <div>
        {previous}
        {next}
      </div>
    )
  } else{
    return null;
  }

}

export default SerialStepper;
