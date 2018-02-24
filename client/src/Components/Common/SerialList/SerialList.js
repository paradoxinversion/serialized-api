import React from "react";
import PropTypes from "prop-types";
import {
  withRouter
} from "react-router-dom";
import SerialEntryContainer from "../../Containers/SerialEntryContainer/SerialEntryContainer";
const SerialList = withRouter((props) => {
  if (props.serials &&  props.serials.length > 0){
    const serials = props.serials.map((serial) => {
      const uri = `/serials/${serial._id}`;
      return (
        <li key={serial._id}>
          <SerialEntryContainer
            serial={serial}
            goToSerial={props.goToSerial}
            serialUri={uri}/>
        </li>
      );
    });
    return (
      <div>
        <h1 className="subtitle"> Serials </h1>
        <ul>{serials}</ul>
      </div>
    );
  } else{
    return <p>{props.emptyListMessage}</p>;
  }
});
SerialList.propTypes = {
  serials: PropTypes.array.isRequired,
  emptyListMessage: PropTypes.string.isRequired
};
export default SerialList;
