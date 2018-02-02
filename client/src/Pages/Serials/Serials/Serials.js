import React from "react";
import PropTypes from "prop-types";
import {
  Route,
  withRouter,
  Redirect,
  Switch
} from "react-router-dom";
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
  }
  render(){
    return (
      <div>
        <div>
          <Switch>
            <Route
              exact path={`${this.props.match.path}/`}
              component={SerialDirectory} />

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
              component={CreateSerialPart} />
            <Route
              path={`${this.props.match.path}/:id/:partId`}
              component={()=>
                <ViewSerialPart serialId={this.props.match.params.id} clientUser={this.props.clientUser}/>} />

            <Route
              path={`${this.props.match.path}/:id`}
              render={()=>
                <SerialOverview clientUser={this.props.clientUser}/>} />

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
