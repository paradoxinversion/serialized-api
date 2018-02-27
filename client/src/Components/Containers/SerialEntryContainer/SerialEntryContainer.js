import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
import "./SerialEntryContainer.css";
const SerialEntryContainer = (props) => {
  let authorOptions;
  if (props.serial && props.clientUser && props.clientUser._id === props.serial.author_id){
    authorOptions = (
      <div>
        <button onClick={()=>{
        }} className="button is-danger level-item">Delete</button>
      </div>
    );

  }
  return (
    <div className="entry-container">
      <h2>{props.serial.title}</h2>
      <p>{props.serial.synopsis}</p>
      <div className="level is-mobile">
        <div className="level-left">
          <Link className="button is-primary" to={`${props.serialUri}`}>Read It</Link>
          <button className="button is-disabled level-item">Subscribe</button>
          {authorOptions}
        </div>

      </div>
    </div>
  );
};

SerialEntryContainer.propTypes = {
  serial: PropTypes.object.isRequired,
  serialUri: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default SerialEntryContainer;
