import React from "react";
import {
  Link,
  withRouter
} from "react-router-dom";

const SerialList = withRouter((props) => {
  if (props.serials.length > 0){
    const serials = props.serials.map((serial) => {
      const uri = `/serials/${serial._id}`;
      return (
        <li key={serial._id}>
          <Link to={{
            pathname: uri
          }}>{serial.title}</Link>

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

export default SerialList;
