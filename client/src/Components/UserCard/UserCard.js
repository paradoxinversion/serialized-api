import React from "react";
import {Link} from "react-router-dom";
import HTMLMarkupContainer from "../Containers/HTMLMarkupContainer/HTMLMarkupContainer";
import "./UserCard.css";

const UserCard = (props) => {
  const uri = `/users/${props.user.username}`;
  return (
    <div className={`card card--vertical ${props.classes}` }key={props.user._id}>
      <p>{props.user.username}</p>
      <Link className="button button--positive" to={{
        pathname: uri
      }}>Visit</Link>

    </div>
  );
};

export default UserCard;