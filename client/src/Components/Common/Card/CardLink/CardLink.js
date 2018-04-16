import React from "react";
import { Link } from "react-router-dom";
const CardLink = (props) => {
  let link;
  if (props.isRouterLink){
    link = (
      <React.Fragment>
        <Link to={props.linkTarget}>{props.linkText}</Link>
      </React.Fragment>
    );
  }else{
    link = (
      <React.Fragment>
        <a src={props.linkTarget}>{props.linkText}</a>
      </React.Fragment>
    );
  }
  return link;
};

export default CardLink;