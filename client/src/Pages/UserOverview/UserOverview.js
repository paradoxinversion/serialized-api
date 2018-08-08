import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import SerialList from "../../Components/Common/SerialList/SerialList";
import getUserSerialSubscriptions from "../../utilityFunctions/serials/getUserSerialSubscriptions";
import "./UserOverview.css";

class UserOverview extends React.Component {
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
          <h1>Dashboard</h1>
          <p> Welcome back, {this.props.clientUser.username} </p>
          <div className="user-overview-options">
            <Link
              className="button user-overview-option"
              to={`/users/${this.props.clientUser.username}`}>
              {" "}
              Profile{" "}
            </Link>
            <Link
              className="button button--primary user-overview-option"
              to="/serials/create">
              New Serial
            </Link>
          </div>
        </header>

        <section className="container">
          <p>Your Serials</p>
          <SerialList
            clientUser={this.props.clientUser}
            headerText="Your Serials"
            emptyListMessage="You have not written any serials yet."
            serials={this.state.clientUserSerials}
          />
          <p>Your Subscriptions</p>
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

UserOverview.propTypes = {
  checkAuthentication: PropTypes.func.isRequired,
  clientUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getClientUserSerials: PropTypes.func
};

export default UserOverview;
