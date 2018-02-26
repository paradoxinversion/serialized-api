import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
import "./OwnedSerialEntryContainer.css";
const OwnedSerialEntryContainer = (props) => {
  return (
    <div>
      <h2>{props.serial.title}</h2>
      <p>{props.serial.synopsis}</p>
      <div className="level is-mobile">
        <div className="level-left">
          <button className="button is-primary level-item" onClick={()=>{
            const location = {
              pathname: props.serialUri
            };
            props.history.push(location);
          }}>Go To Serial</button>
          {/* <button className="button level-item"> Add a Part </button> */}
          <Link className="button level-item" to={`/serials/${props.serial._id}/new`}> Create a New Part </Link>
          <button onClick={()=>{
            props.onSerialDeleted(props.serial._id)
          }} className="button is-danger level-item">Delete</button>
        </div>

      </div>
    </div>
  );
};

OwnedSerialEntryContainer.propTypes = {
  serial: PropTypes.object.isRequired,
  serialUri: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(OwnedSerialEntryContainer);
