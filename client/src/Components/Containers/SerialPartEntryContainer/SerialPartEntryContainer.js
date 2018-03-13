import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";

// Represents a serial part
const SerialPartEntryContainer = (props) => {
  let authorOptions = null;
  let moveUp = null;
  let moveDown = null;
  if (props.currentSerial){

    if (props.clientUser && props.clientUser._id === props.currentSerial.author_id._id){
      if (props.serialPart.part_number > 0){
        moveDown = (
          <button onClick={()=>{
            props.onPartMoved(props.serialPart._id, false)
          }} className="button">Move Down</button>
        )
      }
      if (props.serialPart.part_number < props.serialParts.length-1){
        moveUp = (
          <button onClick={()=>{
            props.onPartMoved(props.serialPart._id, true)
          }} className="button">Move Up</button>
        );
      }

      authorOptions = (
        <div>
          <Link className="button" to={`/serials/${props.currentSerial._id}/${props.serialPart._id}/edit`}>Edit</Link>
          <button onClick={()=>{
            props.onSerialPartDeleted(props.currentSerial._id, props.serialPart._id)
          }} className="button">Delete Part</button>
          {moveUp}
          {moveDown}

        </div>
      )
    }
  }

  return (
    <div>
      <h2>{props.serialPart.title}</h2>
      {/* <p>{props.serialPart.synopsis}</p> */}
      <div className="level is-mobile">
        <div className="level-left">
          <button className="button is-primary level-item" onClick={()=>{
            const location = {
              pathname: props.serialPartUri
            };
            props.history.push(location);
          }}>Read it</button>
          {authorOptions}
        </div>
      </div>
    </div>
  );
};

SerialPartEntryContainer.propTypes = {
  serialPart: PropTypes.object.isRequired,
  serialPartUri: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  currentSerial: PropTypes.object,
  clientUser: PropTypes.clientUser,
  onSerialPartDeleted: PropTypes.func,
  onPartMoved: PropTypes.func
};

export default withRouter(SerialPartEntryContainer);
