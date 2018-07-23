import React, { Component } from "react";
import PropTypes from "prop-types";
import CommandPanel from "./CommandPanel/CommandPanel";
import Genres from "./Genres/Genres";
const adminSections = {
  ["genres"]: Genres
};

class Administration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "genres"
    };
    this.setMode = this.setMode.bind(this);
  }
  async setMode(mode) {
    await this.setState({
      mode
    });
  }
  render() {
    const CurrentWorkspace = adminSections[this.state.mode];

    return (
      <div>
        <CommandPanel />
        <CurrentWorkspace />
      </div>
    );
  }
}

Administration.propTypes = {
  location: PropTypes.object.isRequired
};

export default Administration;
