import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import deleteUser from "../../utilityFunctions/users/deleteUser";
import "./UserCard.css";

const UserCard = props => {
  const uri = `/users/${props.user.username}`;
  return (
    <div
      className={`card card--vertical ${props.classes}`}
      key={props.user._id}>
      {props.clientUser &&
      props.clientUser.role.accessLevel === 2 &&
      props.user._id !== props.clientUser._id ? (
        <button
          onClick={async () => {
            if (window.confirm("Are you sure you wish to delete this user?")) {
              const result = await deleteUser(props.user._id);
            }
          }}>
          Delete User
        </button>
      ) : null}
      <p>{props.user.username}</p>
      <Link
        className="button button--positive"
        to={{
          pathname: uri
        }}>
        Visit
      </Link>
    </div>
  );
};

UserCard.propTypes = {
  clientUser: PropTypes.object,
  user: PropTypes.object,
  classes: PropTypes.string
};

export default UserCard;
