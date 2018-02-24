import React from "react";
import PropTypes from "prop-types";
import {
  withRouter
} from "react-router-dom";
import OwnedSerialEntryContainer from "../../Containers/OwnedSerialEntryContainer/OwnedSerialEntryContainer";
const OwnedSerialList = withRouter((props) => {
  if (props.serials.length > 0){
    const serials = props.serials.map((serial) => {
      const uri = `/serials/${serial._id}`;
      return (
        <li key={serial._id}>

          <OwnedSerialEntryContainer
            serial={serial}
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
OwnedSerialList.propTypes = {
  serials: PropTypes.object.isRequired,
  emptyListMessage: PropTypes.string.isRequired
};
export default OwnedSerialList;
