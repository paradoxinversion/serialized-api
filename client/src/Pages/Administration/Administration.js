import React, { Component } from "react";
import PropTypes from "prop-types";
// import CommandPanel from "./CommandPanel/CommandPanel";
import Genres from "./Genres/Genres";
import Reports from "./Reports/Reports";
import Dashboard from "../../Components/Dashboard/Dashboard";
const adminSections = {
  ["genres"]: Genres,
  ["reports"]: Reports
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
          },
          {
            text: "Reports",
            section: "reports"
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
