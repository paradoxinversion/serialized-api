import React from "react";
import UserCard from "../../Components/UserCard/UserCard";
// import "./UserDirectory.css";
import "./UserList.css";


const UserList =(props) => {
  if (props.users.length > 0){
    const users = props.users.map((user) => {
      return (
        <UserCard user={user} key={user._id} classes="user-list-item"/>
      );
    });
    return (

      <div className="user-list">{users}</div>

    );
  } else{
    return <p> No one has signed up yet. Be the first one to register and tell your story. </p>;
  }
};

export default UserList;
