import React from "react";
import axiosInstance from "../../../axiosInstance";
import PropTypes from "prop-types";
class LogOut extends React.Component {
  componentWillMount() {
    axiosInstance.get("/users/auth/logout");
    this.props.clearUser();
  }

  render() {
    return (
      <div>
        <p>Thanks for coming!</p>
      </div>
    );
  }
}

LogOut.propTypes = {
  clearUser: PropTypes.func.isRequired
};
export default LogOut;
