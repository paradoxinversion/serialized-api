import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import SerialList from "../../Components/Common/SerialList/SerialList";
import getUserSerialSubscriptions from "../../utilityFunctions/serials/getUserSerialSubscriptions";
import "./Dashboard.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribedSerials: [],
      clientUserSerials: []
    };
  }

  async componentDidMount() {
    await this.props.checkAuthentication();
    await this.getSubscribedSerials();
    const clientSerials = await this.props.getClientUserSerials();
    this.setState({
      clientUserSerials: clientSerials
    });
  }

  async getSubscribedSerials() {
    const subscribedSerials = await getUserSerialSubscriptions();
    this.setState({
      subscribedSerials
    });
  }

  render() {
    return (
      <main>
        <header className="container">
          <h1>User Profile</h1>
          <p className="title">
            {" "}
            Welcome back, {this.props.clientUser.username}{" "}
          </p>
          <div className="dashboard-options">
            <Link
              className="button dashboard-option"
              to={`/users/${this.props.clientUser.username}`}>
              {" "}
              Profile{" "}
            </Link>
            <Link
              className="button button--primary dashboard-option"
              to="/serials/create">
              New Serial
            </Link>
          </div>
        </header>

        <section className="container">
          <SerialList
            clientUser={this.props.clientUser}
            headerText="Your Serials"
            emptyListMessage="You have not written any serials yet."
            serials={this.state.clientUserSerials}
          />
          <SerialList
            clientUser={this.props.clientUser}
            headerText="Subscribed Serials"
            emptyListMessage="You have not subscribed to any serials yet."
            serials={this.state.subscribedSerials}
          />
        </section>
      </main>
    );
  }
}

Dashboard.propTypes = {
  checkAuthentication: PropTypes.func.isRequired,
  clientUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getClientUserSerials: PropTypes.func
};

export default Dashboard;
