import React from "react";
import heroImage from "./writing.jpg";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {}
    };

    this.getUsers = this.getUsers.bind(this);
  }
  componentDidMount(){
  }
  getUsers(){
    fetch("/users")
      .then((res) => res.json())
      .then((users) => {
        this.setState({users});
      });
  }
  render() {
    return (
      <div>
        <img src={heroImage} alt="pen and paper"/>
        <p>Serialized is a place for you to find serial fiction or post your own. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    );
  }
}

export default Home;
