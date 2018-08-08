import React from "react";
import { Link } from "react-router-dom";

const ReportButton = props => {
  return (
    <Link
      to={{
        pathname: "/file-report",
        state: {
          user: props.user,
          serial: props.serial,
          serialPart: props.serialPart
        }
      }}>
      Derp
    </Link>
  );
};

export default ReportButton;
