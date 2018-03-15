import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = (props) => {
  return (
    props.authStatus && props.clientUser?
      (
        <div className="horizontal-navbar">
          <div className="navbar-brand">
            <NavLink className="logo" to="/"> Serialized </NavLink>
          </div>

          <div className="navbar-menu">
            <div><NavLink className="navbar-item" to={`/users/${props.clientUser.username}`}> Profile </NavLink></div>
            <div><NavLink className="navbar-item" to="/dashboard"> Dashboard </NavLink></div>
            <div><NavLink className="navbar-item" to="/serials"> Serials </NavLink></div>
            <div><NavLink className="navbar-item" to="/users"> Users </NavLink></div>
            <div><NavLink className="navbar-item" to="/auth/logout"> Log Out </NavLink></div>
          </div>
        </div>
      ):
      (
        <div className="horizontal-navbar">
          <div className="navbar-brand">
            <NavLink className="logo" to="/"> Serialized </NavLink>
          </div>
          <div className="navbar-menu">
            <div><NavLink className="navbar-item" to="/"> Home </NavLink></div>
            <div><NavLink className="navbar-item" to="/auth/login"> Log In </NavLink></div>
            <div><NavLink className="navbar-item" to="/auth/register"> Register </NavLink></div>
            <div><NavLink className="navbar-item" to="/serials"> Serials </NavLink></div>
            <div><NavLink className="navbar-item" to="/users"> Users </NavLink></div>
          </div>
        </div>
      )
  );
};

Header.propTypes = {
  authStatus: PropTypes.bool.isRequired,
  clientUser: PropTypes.object
};

export default Header;
