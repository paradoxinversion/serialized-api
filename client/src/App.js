import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile/Profile";
import Serials from "./Pages/Serials/Serials/Serials";
import Authorization from "./Pages/Authorization/Authorization/Authorization";
import Header from "./Components/Common/Header/Header";
import Footer from "./Components/Common/Footer/Footer";
import UserOverview from "./Pages/UserOverview/UserOverview";
import UserDirectory from "./Pages/UserDirectory/UserDirectory";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import NotFound from "./Pages/NotFound/NotFound";
import checkAuthentication from "./utilityFunctions/authentication/checkAuthentication";
import getSerialAndPartData from "./utilityFunctions/serials/getSerialAndPartData";
import toggleSerialSubscription from "./utilityFunctions/serials/toggleSerialSubscription";
import getClientUserSerials from "./utilityFunctions/serials/getClientUserSerials";
import TermsOfService from "./Pages/Policies/TermsOfService/TermsOfService";
import CodeOfConduct from "./Pages/Policies/CodeOfConduct/CodeOfConduct";
import Administration from "./Pages/Administration/Administration";
import Dashboard from "./Components/Dashboard/Dashboard";
import UserSettings from "./Pages/UserSettings/UserSettings";
import FileReport from "./Pages/FileReport/FileReport";
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

  clearUser() {
    this.setState({
      user: null,
      isAuthenticated: false
    });
  }

  async setAuthStatus(authenticationResponse) {
    await this.setState({
      isAuthenticated: authenticationResponse
    });
  }

  async componentDidMount() {
    try {
      await this.checkAuthentication();
    } catch (e) {
      throw e;
    }
  }

  async checkAuthentication() {
    try {
      const authenticationResult = await checkAuthentication();
      console.log("AUTH", authenticationResult);
      this.setState(authenticationResult);
      return checkAuthentication.isAuthenticated;
    } catch (e) {
      throw e;
    }
  }

  /**
    Sets the current serial being viewed/edited and all parts related to it
  **/
  setSerial(currentSerial, serialParts) {
    this.setState({
      currentSerial,
      serialParts
    });
  }

  /**
    Get the serial matching the serialId and all parts created for it.
  **/
  async getSerialAndPartData(serialId) {
    try {
      const result = await getSerialAndPartData(serialId);
      this.setSerial(result.currentSerial, result.serialParts);
    } catch (e) {
      throw e;
    }
  }

  /**
    Toggle whether or not an authenticated user is subscribed to a serial.
  **/
  async toggleSerialSubscription(serialId) {
    try {
      await toggleSerialSubscription(serialId);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
    Get serials owned by the authenticated user
  **/
  async getClientUserSerials() {
    try {
      return await getClientUserSerials(this.state.user._id);
    } catch (e) {
      console.error("Something went wrong: \n ", e);
    }
  }

  render() {
    return (
      <Router>
        <React.Fragment>
          <div className="main-wrapper">
            <Header
              authStatus={this.state.isAuthenticated}
              clientUser={this.state.user}
            />
            <Switch>
              <Route exact path="/" component={Home} />

              <Route
                path="/auth"
                className="test"
                render={() => (
                  <Authorization
                    clearUser={this.clearUser}
                    onSignIn={this.checkAuthentication}
                    user={this.state.user}
                  />
                )}
              />
              <Route
                path="/users/:username"
                render={() => (
                  <Profile
                    clientUser={this.state.user}
                    toggleSerialSubscription={this.toggleSerialSubscription}
                  />
                )}
              />
              <Route
                path="/users"
                render={() => (
                  <UserDirectory
                    clientUser={this.state.user}
                    authStatus={this.state.isAuthenticated}
                  />
                )}
              />

              <Route
                path="/serials"
                render={() => (
                  <Serials
                    authStatus={this.state.isAuthenticated}
                    clientUser={this.state.user}
                    setSerial={this.setSerial}
                    getSerialData={this.getSerialAndPartData}
                    setCurrentPart={this.setCurrentSerialPart}
                    currentSerial={this.state.currentSerial}
                    serialParts={this.state.serialParts}
                    currentSerialPart={this.state.currentSerialPart}
                    clearCurrentPart={this.clearCurrentSerialPart}
                  />
                )}
              />
              <PrivateRoute
                path="/dashboard"
                checkAuthentication={this.checkAuthentication}
                authStatus={this.state.isAuthenticated}
                clientUser={this.state.user}
                component={Dashboard}
                commandOptions={[
                  {
                    text: "Overview",
                    section: "user-overview"
                  },
                  {
                    text: "Settings",
                    section: "user-settings"
                  }
                ]}
                dashboardSections={{
                  ["user-overview"]: UserOverview,
                  ["user-settings"]: UserSettings
                }}
                initialMode="user-overview"
                getClientUserSerials={this.getClientUserSerials}
              />

              <PrivateRoute
                path="/admin-dashboard"
                clientUser={this.state.user}
                authStatus={this.state.isAuthenticated}
                component={Administration}
              />
              <PrivateRoute
                path="/file-report"
                clientUser={this.state.user}
                authStatus={this.state.isAuthenticated}
                component={FileReport}
              />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route path="/code-of-conduct" component={CodeOfConduct} />

              <Route component={NotFound} />
            </Switch>
          </div>
          <Footer />
        </React.Fragment>
      </Router>
    );
  }
}
export default App;
