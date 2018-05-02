import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = (props) => {
  return (
    props.authStatus && props.clientUser?
      (
        <nav className="horizontal-navbar">
          <div className="navbar-brand">
            <NavLink className="logo" to="/"> Serialized </NavLink>
          </div>

          <div className="navbar-menu">
            <NavLink className="navbar-item" to={`/users/${props.clientUser.username}`}> Profile </NavLink>
            <NavLink className="navbar-item" to="/dashboard"> Dashboard </NavLink>
            <NavLink className="navbar-item" to="/serials"> Serials </NavLink>
            <NavLink className="navbar-item" to="/users"> Users </NavLink>
            <NavLink className="navbar-item" to="/auth/logout"> Log Out </NavLink>
          </div>
        </nav>
      ):
      (
        <nav className="horizontal-navbar">
          <div className="navbar-brand">
            <NavLink className="logo" to="/"> Serialized </NavLink>
          </div>
          <div className="navbar-menu">
            <NavLink className="navbar-item" to="/"> Home </NavLink>
            <NavLink className="navbar-item" to="/auth/login"> Log In </NavLink>
            <NavLink className="navbar-item" to="/auth/register"> Register </NavLink>
            <NavLink className="navbar-item" to="/serials"> Serials </NavLink>
            <NavLink className="navbar-item" to="/users"> Users </NavLink>
          </div>
        </nav>
      )
  );
};

Header.propTypes = {
  authStatus: PropTypes.bool.isRequired,
  clientUser: PropTypes.object
};

export default Header;
