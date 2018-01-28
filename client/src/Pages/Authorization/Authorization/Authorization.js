import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import LogIn from '../LogIn/LogIn';
import Register from '../Register/Register';
import axios from 'axios';
const Authorization = (props) => {
  return (
    <div>
      <div>
        <Route exact path={`${props.match.url}/login`} render={()=> <LogIn setUser={props.setUser} onSignIn={props.onSignIn} />} />
        <Route exact path={`${props.match.url}/register`} render={()=> <Register />} />
        <Route exact path={`${props.match.url}/logout`} render={() =>{
          props.clearUser();
          axios.get('/users/logout');
          return (
            <Redirect to={{
              pathname: '/'
            }}/>
          )
        }}/>
      </div>
    </div>
  )
}
export default withRouter(Authorization);
