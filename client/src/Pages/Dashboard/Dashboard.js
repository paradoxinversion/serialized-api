import React from "react";
import PropTypes from "prop-types";
import {
  Link
} from "react-router-dom";

import axios from "axios";
// import SerialList from "../../Components/Common/SerialList/SerialList";
import OwnedSerialList from "../../Components/Common/OwnedSerialList/OwnedSerialList";
import "./Dashboard.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
  }
  async componentWillMount(){
    await this.props.checkAuthentication();
  }

  render() {
    let createSerial;

    const newSerialLink = `/serials/create`;
    createSerial = <Link className="button level-item" to={newSerialLink}> Create a new Serial </Link>;

    return (
      <div>
        <h1 className="title is-4"> Welcome back, {this.props.clientUser.username} </h1>
        <div className="level">
          <Link className="button level-item" to={`/users/${this.props.clientUser.username}`}> Profile </Link>
        </div>
        {createSerial}
        <OwnedSerialList
          clientUser={this.props.clientUser}
          emptyListMessage="You have not written any serials" />
      </div>
    );
  }
}

Dashboard.propTypes = {
  checkAuthentication: PropTypes.func.isRequired,
  clientUser: PropTypes.object.isRequred,
  history: PropTypes.object.isRequired
};

export default Dashboard;
