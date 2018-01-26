import React from 'react';
import {  NavLink, withRouter, Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/bulma.css'

const UserList = withRouter((props) => {
  console.log("USERLIST PROPS", props)
  if (props.users.length > 0){
    const users = props.users.map((user) => {
      const uri = `/users/${user._id}`
      return (
        <li key={user._id}>
          {/* <Link to={uri}>{user.title}</Link> */}
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
    }
  }

  async getUserData(){
    try{
      const requestConfiguration = {
        withCredentials: true
      };
      const uri = `/users`;
      const userData = await axios.get(uri, requestConfiguration);
      console.log(userData);
      this.setState({
        users: userData.data.userData
      });
    } catch (e){
      console.log("Something went wrong: \n ", e);
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
    )
  }
}

export default UserDirectory;
