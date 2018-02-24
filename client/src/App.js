import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import axios from "axios";
import "./css/bulma.css";
import "./App.css";

/*
  Route Components
*/
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile/Profile";
import Serials from "./Pages/Serials/Serials/Serials";
import Authorization from "./Pages/Authorization/Authorization/Authorization";
import Header from "./Components/Common/Header/Header";
import Footer from "./Components/Common/Footer/Footer";
import Dashboard from "./Pages/Dashboard/Dashboard";
import UserDirectory from "./Pages/UserDirectory/UserDirectory";
import NotFound from "./Pages/NotFound/NotFound";
import store from "store";

const PrivateRoute = ({ component: Component, authStatus, clientUser, checkAuthentication,  ...rest }) => (
  <Route {...rest} render={ (props) => (
    authStatus ? (
      <Component {...props} clientUser={clientUser} checkAuthentication={checkAuthentication} />
    ) : (
      <Redirect to={{
        pathname: "/auth/login",
        state: { from: props.location }
      }}/>
    )
  )}/>
);

PrivateRoute.propTypes = {
  authStatus: PropTypes.bool.isRequired,
  clientUser: PropTypes.object,
  checkAuthentication: PropTypes.func.isRequired,
  component: PropTypes.func,
  location: PropTypes.object
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentSerial: null,
      currentSerialPart: null,
      isAuthenticated: false
    };
    this.setUser = this.setUser.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.getUser = this.getUser.bind(this);
    this.clearUser = this.clearUser.bind(this);

    this.setSerial = this.setSerial.bind(this);
  }

  /**
    Set the user in the store and the client
  **/
  setUser(user){
    const clientUser = {
      username: user.username,
      id: user._id
    };
    store.set("client", {user: clientUser});
    this.setState({
      user: store.get("client").user
    });
  }

  /**
    Get the user in the store
  **/
  getUser(){
    return store.get("client");
  }

  clearUser(){
    store.remove("client");
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
  async componentWillMount(){
    await this.checkAuthentication();
  }

  async checkAuthentication() {
    const uri = "/users/auth";
    const result = await axios.get(uri, {withCredentials: true});
    if (result.data.isAuthenticated){
      console.log("User is authenticated in the server")
      this.setState({
        isAuthenticated: true,
        user: result.data.user
      });
    } else{
      console.log("User is not authenticated in the server")

      this.setState({
        isAuthenticated: false,
        user: null
      });
    }
    // otherwise, make sure authentication is false
  }
  setSerial(currentSerial){
    this.setState({
      currentSerial
    });
  }
  render() {
    return (
      <Router>

        <div>
          <div className="main-wrapper">
            <Header authStatus={this.state.isAuthenticated} clientUser={this.state.user}/>
            <div className="container is-fluid">
              <Switch>
                <Route
                  exact path="/"
                  component={Home}/>

                <Route
                  path="/auth"
                  render={() =>
                    <Authorization
                      clearUser={this.clearUser}
                      setUser={this.setUser}
                      onSignIn={this.checkAuthentication}
                      user={this.state.user} />} />
                <Route
                  path="/users/:username"
                  render={ () =>
                    <Profile
                      clientUser={this.state.user}/>} />
                <Route
                  path="/users"
                  authStatus={this.state.isAuthenticated}
                  clientUser={this.state.user}
                  component={UserDirectory} />

                <Route
                  path="/serials"
                  render={()=>
                    <Serials
                      authStatus={this.state.isAuthenticated}
                      clientUser={this.state.user}
                      setSerial={this.setSerial}/> } />

                <PrivateRoute
                  path="/dashboard"
                  checkAuthentication={this.checkAuthentication}
                  authStatus={this.state.isAuthenticated}
                  clientUser={this.state.user}
                  component={Dashboard} />

                <Route component={NotFound} />
              </Switch>

            </div>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}
export default App;
