import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import CommandPanel from "./CommandPanel/CommandPanel";

let dashboardSections = {};
class Administration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "uninitialized"
    };
    this.setMode = this.setMode.bind(this);
  }
  async setMode(mode) {
    await this.setState({
      mode
    });
  }

  async setDashboardSections(dashboardSectionsObject) {
    dashboardSections = dashboardSectionsObject;
  }
  render() {
    const CurrentWorkspace = dashboardSections[this.state.mode];

    return (
      <div>
        {dashboardSections.getOwnPropertyNames.length > 0 ? (
          <Fragment>
            {" "}
            <CommandPanel />
            <CurrentWorkspace />{" "}
          </Fragment>
        ) : (
          <p>No dashboard sections</p>
        )}
      </div>
    );
  }
}

Administration.propTypes = {
  location: PropTypes.object.isRequired,
  initialMode: PropTypes.string
};

export default Administration;
