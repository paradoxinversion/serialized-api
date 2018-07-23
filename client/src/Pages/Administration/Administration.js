import React, { Component } from "react";
import PropTypes from "prop-types";
// import CommandPanel from "./CommandPanel/CommandPanel";
import Genres from "./Genres/Genres";
import Dashboard from "../../Components/Dashboard/Dashboard";
const adminSections = {
  ["genres"]: Genres
};

class Administration extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dashboard
        dashboardSections={adminSections}
        initialMode="genres"
        commandOptions={[
          {
            text: "Genres",
            section: "genres"
          }
        ]}
      />
    );
  }
}

Administration.propTypes = {
  location: PropTypes.object.isRequired
};

export default Administration;
