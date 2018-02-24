import React from "react";
import PropTypes from "prop-types";
import {
  Route,
  withRouter,
  Redirect,
  Switch
} from "react-router-dom";
import axios from "axios";
import CreateSerial from "../CreateSerial/CreateSerial";
import CreateSerialPart from "../CreateSerialPart/CreateSerialPart";
import ViewSerialPart from "../ViewSerialPart/ViewSerialPart";
import SerialOverview from "../SerialOverview/SerialOverview";
import EditSerial from "../EditSerial/EditSerial";
import EditSerialPart from "../EditSerialPart/EditSerialPart";
import SerialDirectory from "../SerialDirectory/SerialDirectory";
import NotFound from "../../NotFound/NotFound";

const PrivateRoute = ({ component: Component, authStatus, clientUser,  ...rest }) => (
  <Route {...rest} render={ (props) => (
    authStatus ? (
      <Component {...props} clientUser={clientUser} />
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
  match: PropTypes.object,
  component: PropTypes.func.isRequired,
  location: PropTypes.object
};

class Serials extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      serialDirectoryLookup: null,
      currentSerial: null,
      serialParts: null,
      currentPart: null
    };
    this.getUserSerialData = this.getUserSerialData.bind(this);
    this.getSerialAndPartData = this.getSerialAndPartData.bind(this);
  }

  async getUserSerialData(){
    try{
      const requestConfiguration = {
        withCredentials: true
      };
      const uri = `/serials`;
      const serialData = await axios.get(uri, requestConfiguration);
      this.setState({
        serialDirectoryLookup: serialData.data
      });
    } catch (e){
      console.error("Something went wrong: \n ", e);
    }
  }

  async getSerialAndPartData(serialId){
    const uri = `/serials/${serialId}`;
    const config = {
      withCredentials: true
    };
    const result = await axios.get(uri, config);
    console.log(result.data.serial);
    this.setState({
      currentSerial: result.data.serial,
      serialParts: result.data.serialParts
    });

    this.props.setSerial(result.data.serial);
  }

  async getSerialPartData(serialId, partId){
    const uri = `/serials/${serialId}/${partId}`;
    const configuration = {
      withCredentials: true
    };
    const serialPartData = await axios.get(uri, configuration);
    this.setState({
      currentSerial: serialPartData.data.parentSerial,
      currentPart: serialPartData.data.part
    });
  }
  render(){
    return (
      <div>
        <div>
          <Switch>
            <Route
              exact path={`${this.props.match.path}/`}
              render={() =>
                <SerialDirectory
                  lookupSerials={this.getUserSerialData}
                  serials={this.state.serialDirectoryLookup} />} />

            <PrivateRoute
              path={`${this.props.match.path}/create`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              component={CreateSerial} />

            <PrivateRoute
              path={`${this.props.match.path}/:id/:partId/edit`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              component={EditSerialPart} />

            <PrivateRoute
              path={`${this.props.match.path}/:id/edit`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              component={EditSerial} />

            <PrivateRoute
              path={`${this.props.match.path}/:id/new`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              derp="tesdt"
              component={CreateSerialPart} />
            <Route
              path={`${this.props.match.path}/:id/:partId`}
              component={()=>
                <ViewSerialPart serialId={this.props.match.params.id} clientUser={this.props.clientUser}/>} />

            <Route
              path={`${this.props.match.path}/:id`}
              render={()=>
                <SerialOverview
                  getSerialData={this.getSerialAndPartData}
                  serial={this.state.currentSerial}
                  serialParts={this.state.serialParts}
                  clientUser={this.props.clientUser}/>} />

            <Route component={NotFound} />
          </Switch>

        </div>
      </div>
    );
  }
}

Serials.propTypes = {
  authStatus: PropTypes.bool.isRequired,
  clientUser: PropTypes.object,
  match: PropTypes.object.isRequired
};

export default withRouter(Serials);
