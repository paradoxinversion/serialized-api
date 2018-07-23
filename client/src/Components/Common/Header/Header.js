import React from "react";
import PropTypes from "prop-types";
import { NavLink, Link } from "react-router-dom";
import "./Header.css";

const Header = props => {
  return props.authStatus && props.clientUser ? (
    <div className="horizontal-navbar">
      <div className="navbar-brand">
        <Link className="logo" to="/">
          {" "}
          Serialized{" "}
        </Link>
      </div>

      <nav className="navbar-menu">
        {props.clientUser.role.accessLevel === 2 ? (
          <NavLink className="navbar-item" to="/admin-dashboard">
            {" "}
            Admin Panel{" "}
          </NavLink>
        ) : null}
        <NavLink
          className="navbar-item"
          to={`/users/${props.clientUser.username}`}>
          {" "}
          Profile{" "}
        </NavLink>
        <NavLink className="navbar-item" to="/dashboard">
          {" "}
          Dashboard{" "}
        </NavLink>
        <NavLink className="navbar-item" to="/serials">
          {" "}
          Serials{" "}
        </NavLink>
        <NavLink className="navbar-item" to="/users">
          {" "}
          Users{" "}
        </NavLink>
        <NavLink className="navbar-item" to="/auth/logout">
          {" "}
          Log Out{" "}
        </NavLink>
      </nav>
    </div>
  ) : (
    <div className="horizontal-navbar">
      <div className="navbar-brand">
        <NavLink className="logo" to="/">
          {" "}
          Serialized{" "}
        </NavLink>
      </div>
      <nav className="navbar-menu">
        <NavLink className="navbar-item" to="/">
          {" "}
          Home{" "}
        </NavLink>
        <NavLink className="navbar-item" to="/auth/login">
          {" "}
          Log In{" "}
        </NavLink>
        <NavLink className="navbar-item" to="/auth/register">
          {" "}
          Register{" "}
        </NavLink>
        <NavLink className="navbar-item" to="/serials">
          {" "}
          Serials{" "}
        </NavLink>
        <NavLink className="navbar-item" to="/users">
          {" "}
          Users{" "}
        </NavLink>
      </nav>
    </div>
  );
};

Header.propTypes = {
  authStatus: PropTypes.bool.isRequired,
  clientUser: PropTypes.object
};

export default Header;
