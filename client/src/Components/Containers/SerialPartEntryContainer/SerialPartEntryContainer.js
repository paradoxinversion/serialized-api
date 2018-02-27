import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
const SerialEntryContainer = (props) => {
  let authorOptions = null;
  if (props.currentSerial){

    if (props.clientUser && props.clientUser._id == props.currentSerial.author_id._id){
      authorOptions = (
        <div>
          <Link to={`/serials/${props.currentSerial._id}/${props.serialPart._id}/edit`}>Edit</Link>
          <button onClick={()=>{
            props.onSerialPartDeleted(props.currentSerial._id, props.serialPart._id)
          }} className="button">Delete Part</button>
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

SerialEntryContainer.propTypes = {
  serialPart: PropTypes.object.isRequired,
  serialPartUri: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(SerialEntryContainer);
