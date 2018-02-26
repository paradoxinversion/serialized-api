import React from "react";
import {
  withRouter
} from "react-router-dom";
import SerialPartEntryContainer from "../../Containers/SerialPartEntryContainer/SerialPartEntryContainer";

const SerialPartList = withRouter((props) => {
  if (props.serialParts.length > 0){
    const serials = props.serialParts.map((serialPart) => {
      const uri = `/serials/${props.parentSerial._id}/${serialPart._id}`;
      return (
        <li key={serialPart._id}>
          <SerialPartEntryContainer serialPart={serialPart} serialPartUri={uri} />
        </li>
      );
    });
    return (
      <div>
        <h1 className="subtitle"> Parts </h1>
        <ul>{serials}</ul>
      </div>
    );
  } else{
    return <p> There are not any parts for this serial yet. </p>;
  }
});

export default SerialPartList;
