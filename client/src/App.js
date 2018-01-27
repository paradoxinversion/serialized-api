import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import axios from 'axios';
import './css/bulma.css';
import './App.css';


/*
  Route Components
*/
import Home from './Pages/Home/Home';
import LogIn from './Pages/LogIn';
import Register from './Pages/Register';
import Profile from './Pages/Profile/Profile';
import Serials from './Pages/Serials';
import Authorization from './Pages/Authorization'
import Header from './Components/Common/Header/Header';
import Footer from './Components/Common/Footer/Footer';
import Dashboard from './Pages/Dashboard/Dashboard';
import UserDirectory from './Pages/UserDirectory'
import store from 'store';

const PrivateRoute = ({ component: Component, authStatus, clientUser,  ...rest }) => (
  <Route {...rest} render={ (props) => (
    authStatus ? (
      <Component {...props} clientUser={clientUser} />
    ) : (
      <Redirect to={{
        pathname: '/auth/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

class App extends Component {
  constructor(props) {
    super(props);
    this.setUser = this.setUser.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.getUser = this.getUser.bind(this);
    this.clearUser = this.clearUser.bind(this);
    this.state = {
      user: null,
      isAuthenticated: false
    };

    // Check our store and make sure the returned object has > 0 keys
    if (this.getUser() && Object.keys(this.getUser()).length > 0){
      this.state.user = this.getUser().user;
      this.state.isAuthenticated = true;
    }else {
      this.state.isAuthenticated = false;
    }
  }

  /**
    Set the user in the store and the client
  **/
  setUser(user){
    const clientUser = {
      username: user.username,
      id: user._id
    };
    store.set('client', {user: clientUser});
    this.setState({
      user: store.get('client').user
    });
  }

  /**
    Get the user in the store
  **/
  getUser(){
    return store.get('client');
  }

  clearUser(){
    store.remove('client');
    this.setState({
      user: null,
      isAuthenticated: false
    });
  }
  setAuthStatus(authenticationResponse){
    this.setState({
      isAuthenticated: authenticationResponse
    });
  }

  // Check if a user is in the store. If not, check if the server has a session
  async checkAuthentication() {
    if (store.get('client')){
      this.setAuthStatus(true);
    } else {
      const uri = `/users/auth`;
      const configuration = {
        withCredentials: true
      };
      const authenticationCheckResponse = await axios.get(uri, configuration);

      this.setAuthStatus(authenticationCheckResponse.data.isAuthenticated);
      if (this.state.isAuthenticated){
        this.setUser(authenticationCheckResponse.data.user);
      }
    }
  }

  render() {
    return (
      <Router>

        <div>
          <div className="main-wrapper">
            <Header authStatus={this.state.isAuthenticated} clientUser={this.state.user}/>
            <div className="container is-fluid">
              <Route
                exact path="/"
                component={Home}/>

              <Route
                path="/auth"
                render={() =>
                  <Authorization
                    clearUser={this.clearUser}
                    setUser={this.setUser}
                    onSignIn={this.setAuthStatus.bind(this)}
                    user={this.state.user} />} />
              <Route
                exact path="/users"
                authStatus={this.state.isAuthenticated}
                clientUser={this.state.user}
                component={UserDirectory} />
              <Route
                path="/profile/:username"
                render={ () =>
                  <Profile
                    onLoad={this.checkAuthentication}
                    clientUser={this.state.user}/>} />

              <Route
                path="/serials"
                render={()=>
                  <Serials
                    authStatus={this.state.isAuthenticated}
                    clientUser={this.state.user}/> } />

              <PrivateRoute
                path="/dashboard"
                authStatus={this.state.isAuthenticated}
                clientUser={this.state.user}
                component={Dashboard} />


            </div>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}
export default App;
