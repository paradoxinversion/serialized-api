import React from "react";
import {
  withRouter,
  Link
} from "react-router-dom";
import getUserData from "../../utilityFunctions/users/getUserData";
import axios from "axios";
import "../../css/bulma.css";

const UserList = withRouter((props) => {
  if (props.users.length > 0){
    const users = props.users.map((user) => {
      const uri = `/users/${user.username}`;
      return (
        <li key={user._id}>
          <Link to={{
            pathname: uri
          }}>{user.username}</Link>

        </li>
      );
    });
    return (
      <div>
        <h1 className="subtitle"> Users </h1>
        <ul>{users}</ul>
      </div>
    );
  } else{
    return <p> No one has signed up yet. Be the first one to register and tell your story. </p>;
  }
});

class UserDirectory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      users: {}
    };
  }

  async getUserData(){
    try{
      const userData = await getUserData();
      this.setState({
        users: userData.data.userData
      });
    } catch (e){
      console.error("Something went wrong: \n ", e);
    }
  }

  componentWillMount(){
    this.getUserData();
  }
  render () {
    return (
      <div>
        <h1 className="title">Directory</h1>
        <UserList users={this.state.users} />
      </div>
    );
  }
}

export default UserDirectory;
