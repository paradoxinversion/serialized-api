import React from "react";
import PropTypes from "prop-types";
import {
  Route,
  Redirect} from "react-router-dom";
const PrivateRoute = ({ component: Component, authStatus,  ...rest }) => {
  return (
    <Route
      {...rest}
      render={ (props) => ( authStatus
        ? ( <Component {...rest} {...props} />)
        : (<Redirect
          to={{
            pathname: "/auth/login",
            state: { from: props.location }
          }}/>
        )
      )}/>
  );
};

PrivateRoute.propTypes = {
  authStatus: PropTypes.bool.isRequired,
  clientUser: PropTypes.object,
  match: PropTypes.object,
  component: PropTypes.func.isRequired,
  location: PropTypes.object
};
export default PrivateRoute;
