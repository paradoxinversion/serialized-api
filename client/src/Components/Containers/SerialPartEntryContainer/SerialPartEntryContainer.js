import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import "./SerialPartEntryContainer.css";
// Represents a serial part
const SerialPartEntryContainer = props => {
  if (props.currentSerial) {
    return (
      <div className="card serial-part-entry-container">
        <h2 className="serial-part-title">{props.serialPart.title}</h2>
        <div className="serial-part-entry-options">
          <div className="serial-part-author-options">
            <button
              className="button button--primary serial-part-entry-option-item"
              onClick={() => {
                const location = {
                  pathname: props.serialPartUri
                };
                props.history.push(location);
              }}>
              Read
            </button>
            {props.clientUser &&
            props.clientUser._id === props.currentSerial.author_id._id ? (
              <React.Fragment>
                <Link
                  className="button button--warn serial-part-entry-option-item"
                  to={`/serials/${props.currentSerial._id}/${
                    props.serialPart._id
                  }/edit`}>
                  Edit
                </Link>
                <button
                  onClick={() => {
                    props.onSerialPartDeleted(
                      props.currentSerial._id,
                      props.serialPart._id
                    );
                  }}
                  className="button button--danger serial-part-entry-option-item">
                  Delete
                </button>
              </React.Fragment>
            ) : null}
          </div>
          <div className="serial-placement-options serial-part-entry-option-item">
            {props.clientUser &&
            props.clientUser._id === props.currentSerial.author_id._id &&
            props.serialPart.part_number > 0 ? (
              <React.Fragment>
                <button
                  onClick={() => {
                    props.onPartMoved(props.serialPart._id, false);
                  }}
                  className="button serial-placement-selector">
                  <i className="fas fa-chevron-up" />
                </button>
              </React.Fragment>
            ) : null}

            {props.clientUser &&
            props.clientUser._id === props.currentSerial.author_id._id &&
            props.serialPart.part_number < props.serialParts.length - 1 ? (
              <React.Fragment>
                <button
                  onClick={() => {
                    props.onPartMoved(props.serialPart._id, true);
                  }}
                  className="button serial-placement-selector">
                  <i className="fas fa-chevron-down" />
                </button>
              </React.Fragment>
            ) : null}
          </div>
        </div>
      </div>
    );
  } else {
    return <p> ... </p>;
  }
};

SerialPartEntryContainer.propTypes = {
  serialPart: PropTypes.object.isRequired,
  serialPartUri: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  currentSerial: PropTypes.object,
  clientUser: PropTypes.object,
  onSerialPartDeleted: PropTypes.func,
  onPartMoved: PropTypes.func
};

export default withRouter(SerialPartEntryContainer);
