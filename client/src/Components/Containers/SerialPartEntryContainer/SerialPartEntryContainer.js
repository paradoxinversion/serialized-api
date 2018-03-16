import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
import "./SerialPartEntryContainer.css";
// Represents a serial part
const SerialPartEntryContainer = (props) => {
  if (props.currentSerial){
    return (
      <div className="serial-part-entry-container">
        <h2>{props.serialPart.title}</h2>
        {/* <p>{props.serialPart.synopsis}</p> */}
        <div className="serial-part-entry-options">

          <button className="button serial-part-entry-option-item" onClick={()=>{
            const location = {
              pathname: props.serialPartUri
            };
            props.history.push(location);
          }}>Read it</button>
          {
            (props.clientUser && props.clientUser._id === props.currentSerial.author_id._id) ?
              (<React.Fragment>
                <Link className="button serial-part-entry-option-item" to={`/serials/${props.currentSerial._id}/${props.serialPart._id}/edit`}>Edit</Link>
                <button onClick={()=>{
                  props.onSerialPartDeleted(props.currentSerial._id, props.serialPart._id)
                }} className="button serial-part-entry-option-item">Delete Part</button>
              </React.Fragment>) :
              null
          }
          {
            (props.clientUser && props.clientUser._id === props.currentSerial.author_id._id && props.serialPart.part_number > 0) ?
              ( <React.Fragment>
                <button onClick={()=>{
                  props.onPartMoved(props.serialPart._id, false)
                }} className="button serial-part-entry-option-item"><i className="fas fa-chevron-up"></i></button>
              </React.Fragment>) :
              null
          }

          {
            (props.clientUser && props.clientUser._id === props.currentSerial.author_id._id && props.serialPart.part_number < props.serialParts.length-1) ?
              ( <React.Fragment>
                <button onClick={()=>{
                  props.onPartMoved(props.serialPart._id, true)
                }} className="button serial-part-entry-option-item"><i className="fas fa-chevron-down"></i></button>
              </React.Fragment> ) :
              null
          }

        </div>
      </div>
    );
  } else {
    return <p> ... </p>
  }

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
