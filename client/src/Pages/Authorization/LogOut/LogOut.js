import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
class LogOut extends React.Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
    axios.get("/users/auth/logout");
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
