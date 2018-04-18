import React from "react";
import {
  Route,
  withRouter
} from "react-router-dom";
import PropTypes from "prop-types";
import LogIn from "../LogIn/LogIn";
import Register from "../Register/Register";
import LogOut from "../LogOut/LogOut";
const Authorization = (props) => {
  return (
    <React.Fragment>
      <Route
        exact path={`${props.match.url}/login`}
        render={()=>
          <LogIn
            onSignIn={props.onSignIn}
          />} />

      <Route
        exact path={`${props.match.url}/register`}
        render={()=> <Register />} />

      <Route
        exact path={`${props.match.url}/logout`}
        render={() =>
          <LogOut
            clearUser={props.clearUser} /> }/>
    </React.Fragment>
  );
};

Authorization.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  clearUser: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};
export default withRouter(Authorization);
