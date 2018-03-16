import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
// import "./css/bulma.css";
import "./App.css";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile/Profile";
import Serials from "./Pages/Serials/Serials/Serials";
import Authorization from "./Pages/Authorization/Authorization/Authorization";
import Header from "./Components/Common/Header/Header";
import Footer from "./Components/Common/Footer/Footer";
import Dashboard from "./Pages/Dashboard/Dashboard";
import UserDirectory from "./Pages/UserDirectory/UserDirectory";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import NotFound from "./Pages/NotFound/NotFound";
import checkAuthentication from "./utilityFunctions/authentication/checkAuthentication";
import getSerialAndPartData from "./utilityFunctions/serials/getSerialAndPartData";
import toggleSerialSubscription from "./utilityFunctions/serials/toggleSerialSubscription";
import getClientUserSerials from "./utilityFunctions/serials/getClientUserSerials";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentSerial: null,
      serialParts: null,
      isAuthenticated: false
    };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.clearUser = this.clearUser.bind(this);

    this.setSerial = this.setSerial.bind(this);
    this.getSerialAndPartData = this.getSerialAndPartData.bind(this);
    this.getClientUserSerials = this.getClientUserSerials.bind(this);
  }

  clearUser(){
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

  async componentDidMount(){
    try{
      await this.checkAuthentication();
    } catch (e){
      throw e;
    }

  }

  async checkAuthentication() {
    try{
      const authenticationResult = await checkAuthentication();
      this.setState(authenticationResult);
    } catch (e) {
      throw e;
    }

  }

  /**
    Sets the current serial being viewed/edited and all parts related to it
  **/
  setSerial(currentSerial, serialParts){
    this.setState({
      currentSerial,
      serialParts
    });
  }

  /**
    Get the serial matching the serialId and all parts created for it.
  **/
  async getSerialAndPartData(serialId){
    try{
      const result = await getSerialAndPartData(serialId);
      this.setSerial(result.currentSerial, result.serialParts);
    } catch (e) {
      throw e;
    }

  }

  /**
    Toggle whether or not an authenticated user is subscribed to a serial.
  **/
  async toggleSerialSubscription(serialId){
    try{
      await toggleSerialSubscription(serialId);
    } catch (e){
      console.log(e);
      throw e;
    }
  }

  /**
    Get serials owned by the authenticated user
  **/
  async getClientUserSerials(){
    try{
      return await getClientUserSerials(this.state.user._id);
    } catch (e){
      console.error("Something went wrong: \n ", e);
    }
  }

  render() {
    return (
      <Router>
        <div>
          <div className="main-wrapper">
            <Header authStatus={this.state.isAuthenticated} clientUser={this.state.user}/>
            <div className="container">
              <Switch>
                <Route
                  exact path="/"
                  component={Home}/>

                <Route
                  path="/auth"
                  render={() =>
                    <Authorization
                      clearUser={this.clearUser}
                      onSignIn={this.checkAuthentication}
                      user={this.state.user} />} />
                <Route
                  path="/users/:username"
                  render={ () =>
                    <Profile
                      clientUser={this.state.user}
                      toggleSerialSubscription={this.toggleSerialSubscription}/>} />
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
                      setSerial={this.setSerial}
                      getSerialData={this.getSerialAndPartData}
                      setCurrentPart={this.setCurrentSerialPart}
                      currentSerial={this.state.currentSerial}
                      serialParts={this.state.serialParts}
                      currentSerialPart={this.state.currentSerialPart}
                      clearCurrentPart={this.clearCurrentSerialPart}/> } />

                <PrivateRoute
                  path="/dashboard"
                  checkAuthentication={this.checkAuthentication}
                  authStatus={this.state.isAuthenticated}
                  clientUser={this.state.user}
                  component={Dashboard}
                  getClientUserSerials={this.getClientUserSerials}/>
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
