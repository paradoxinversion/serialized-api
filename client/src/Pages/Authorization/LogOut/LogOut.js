import React from "react";
import axiosInstance from "../../../axiosInstance";
import PropTypes from "prop-types";
class LogOut extends React.Component {
  componentDidMount() {
    axiosInstance.get("/users/auth/logout");
    this.props.clearUser();
  }

  render() {
    return (
      <main>
        <p>Thanks for coming!</p>
      </main>
    );
  }
}

LogOut.propTypes = {
  clearUser: PropTypes.func.isRequired
};
export default LogOut;
