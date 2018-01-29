import React from "react";
import axios from "axios";
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

export default LogOut;
