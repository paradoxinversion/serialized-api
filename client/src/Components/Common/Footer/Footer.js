import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
const Footer = () => {
  return (
    <div className="footer">
      <p className="footer-text"> Footer </p>
      <Link to="/terms-of-service">Term of Use</Link>
      <Link to="/code-of-conduct">Code of Conduct</Link>
    </div>
  );
};

export default Footer;
