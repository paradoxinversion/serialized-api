import React from "react";
import PropTypes from "prop-types";
import {
  Route,
  withRouter,
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
import PrivateRoute from "../../../Components/PrivateRoute/PrivateRoute";
import NotFound from "../../NotFound/NotFound";


class Serials extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      serialDirectoryLookup: null,
    };
    this.getUserSerialData = this.getUserSerialData.bind(this);
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
                  serials={this.state.serialDirectoryLookup}
                  currentSerial={this.props.currentSerial}
                  clientUser={this.props.clientUser} />} />

            <PrivateRoute
              path={`${this.props.match.path}/create`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              component={CreateSerial} />

            <PrivateRoute
              path={`${this.props.match.path}/:id/:partId/edit`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              currentSerial={this.props.currentSerial}
              serialParts={this.props.serialParts}
              currentSerialPart={this.props.currentSerialPart}
              component={EditSerialPart} />

            <PrivateRoute
              path={`${this.props.match.path}/:id/edit`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              currentSerial={this.props.currentSerial}
              component={EditSerial} />

            <PrivateRoute
              path={`${this.props.match.path}/:id/new`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              getSerialData={this.props.getSerialData}
              component={CreateSerialPart}
              currentSerial={this.props.currentSerial}
              serialParts={this.props.serialParts}
              currentSerialPart={this.props.currentSerialPart}/>
            <Route

              path={`${this.props.match.path}/:id/:partId`}
              component={()=>
                <ViewSerialPart
                  getSerialData={this.props.getSerialData}
                  clientUser={this.props.clientUser}
                  currentSerial={this.props.currentSerial}
                  serialParts={this.props.serialParts}
                  setCurrentPart={this.props.setCurrentPart}
                  currentSerialPart={this.props.currentSerialPart}
                />} />

            <Route
              path={`${this.props.match.path}/:id`}
              render={()=>
                <SerialOverview
                  getSerialData={this.props.getSerialData}
                  serial={this.props.currentSerial}
                  serialParts={this.props.serialParts}
                  clientUser={this.props.clientUser}
                  currentSerial={this.props.currentSerial}
                />} />

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
  match: PropTypes.object.isRequired,
  currentSerial: PropTypes.object,
  serialParts: PropTypes.array,
  currentSerialPart: PropTypes.object,
  getSerialData: PropTypes.func
};

export default withRouter(Serials);
