import React from "react";

import getUserData from "../../utilityFunctions/users/getUserData";
// import UserCard from "../../Components/UserCard/UserCard";
import UserList from "../../Components/UserList/UserList";
import "./UserDirectory.css";

class UserDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {}
    };
  }

  async getUserData() {
    try {
      const userData = await getUserData();
      this.setState({
        users: userData.data.userData
      });
    } catch (e) {
      console.error("Something went wrong: \n ", e);
    }
  }

  componentDidMount() {
    this.getUserData();
  }
  render() {
    return (
      <div>
        <header className="container">
          <h1 className="title">Serialized Users</h1>
        </header>
        <section className="container">
          <UserList
            clientUser={this.props.clientUser}
            users={this.state.users}
          />
        </section>
      </div>
    );
  }
}

export default UserDirectory;
