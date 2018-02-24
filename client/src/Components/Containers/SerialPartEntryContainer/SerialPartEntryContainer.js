import React from "react";
import PropTypes from "prop-types";
import {
  withRouter
} from "react-router-dom";
const SerialEntryContainer = (props) => {
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
