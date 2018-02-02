import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "../../../css/bulma.css";
import "./Header.css";

const Header = (props) => {
  return (
    props.authStatus && props.clientUser?
      (
        <div className="navbar">
          <div className="navbar-brand">
            <NavLink className="logo" to="/"> Serialized </NavLink>
            <button className="button is-small navbar-burger nav-toggle" onClick={()=> {
              let burger = document.querySelector(".navbar-burger");
              let menu = document.querySelector(".navbar-menu");
              burger.classList.toggle("is-active");
              menu.classList.toggle("is-active");
            }}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <div><NavLink className="navbar-item" to={`/profile/${props.clientUser.username}`}> Profile </NavLink></div>
              <div><NavLink className="navbar-item" to="/dashboard"> Dashboard </NavLink></div>
              <div><NavLink className="navbar-item" to="/serials"> Serials </NavLink></div>
              <div><NavLink className="navbar-item" to="/users"> Users </NavLink></div>
              <div><NavLink className="navbar-item" to="/auth/logout"> Log Out </NavLink></div>
            </div>
          </div>

        </div>
      ):
      (
        <div className="navbar">
          <div className="navbar-brand">
            <NavLink className="logo" to="/"> Serialized </NavLink>
            <button className="button is-small navbar-burger nav-toggle" onClick={()=> {
              let burger = document.querySelector(".navbar-burger");
              let menu = document.querySelector(".navbar-menu");
              burger.classList.toggle("is-active");
              menu.classList.toggle("is-active");
            }}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <div><NavLink className="navbar-item" to="/"> Home </NavLink></div>
              <div><NavLink className="navbar-item" to="/auth/login"> Log In </NavLink></div>
              <div><NavLink className="navbar-item" to="/auth/register"> Register </NavLink></div>
              <div><NavLink className="navbar-item" to="/serials"> Serials </NavLink></div>
              <div><NavLink className="navbar-item" to="/users"> Users </NavLink></div>
            </div>
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
