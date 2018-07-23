import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import CommandPanel from "../CommandPanel/CommandPanel";
import "./Dashboard.css";
// Anything visible to the world (unauthenticated users) should not be behind a dashboard

let dashboardSections = {};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "uninitialized",
      loaded: false
    };
    console.log(this.props);
    this.setMode = this.setMode.bind(this);
  }
  async setMode(mode) {
    await this.setState({
      mode
    });
  }

  async setDashboardSections(dashboardSectionsObject) {
    dashboardSections = dashboardSectionsObject;
    console.log("DS:", dashboardSections);
    this.setState({
      loaded: true
    });
  }

  async componentDidMount() {
    await this.setState({
      mode: this.props.initialMode
    });
    console.log("Dashboard Sections: ", this.props.dashboardSections);
    await this.setDashboardSections(this.props.dashboardSections);
    console.log(Object.getOwnPropertyNames(dashboardSections).length);
  }
  render() {
    let CurrentWorkspace;
    if (this.state.loaded) {
      CurrentWorkspace = dashboardSections[this.state.mode];
    }

    return (
      <div className="horizontal-container">
        {this.state.loaded ? (
          <Fragment>
            {" "}
            <CommandPanel
              setMode={this.setMode}
              commandOptions={this.props.commandOptions}
            />
            <CurrentWorkspace
              clientUser={this.props.clientUser}
              getClientUserSerials={this.props.getClientUserSerials}
              checkAuthentication={this.props.checkAuthentication}
            />
          </Fragment>
        ) : (
          <p>No dashboard sections</p>
        )}
      </div>
    );
  }
}

Dashboard.propTypes = {
  location: PropTypes.object.isRequired,
  initialMode: PropTypes.string,
  commandOptions: PropTypes.array.isRequired
};

export default Dashboard;
