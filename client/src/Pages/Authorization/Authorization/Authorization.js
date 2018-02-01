import React from "react";
import {
  Route,
  withRouter
} from "react-router-dom";
import LogIn from "../LogIn/LogIn";
import Register from "../Register/Register";
import LogOut from "../LogOut/LogOut";
const Authorization = (props) => {
  return (
    <div>
      <div>
        <Route
          exact path={`${props.match.url}/login`}
          render={()=>
            <LogIn
              setUser={props.setUser}
              // onSignIn={props.onSignIn}
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
      </div>
    </div>
  );
};
export default withRouter(Authorization);
