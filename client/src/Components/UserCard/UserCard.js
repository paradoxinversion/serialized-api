import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./UserCard.css";

const UserCard = props => {
  const uri = `/users/${props.user.username}`;
  return (
    <div
      className={`card card--vertical ${props.classes}`}
      key={props.user._id}
    >
      <p>{props.user.username}</p>
      <Link
        className="button button--positive"
        to={{
          pathname: uri
        }}
      >
        Visit
      </Link>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.object,
  classes: PropTypes.string
};

export default UserCard;
