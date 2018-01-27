import React from 'react';

import {
  Route,
  withRouter,
  Redirect,
  Link,
  Switch
} from 'react-router-dom';
import CreateSerial from './CreateSerial';
import CreateSerialPart from './CreateSerialPart';
import ViewSerialPart from './ViewSerialPart';
import SerialOverview from './SerialOverview/SerialOverview';
import EditSerial from './EditSerial';
import EditSerialPart from './EditSerialPart';
import SerialDirectory from './SerialDirectory';
const BrowseSerials = () => {
  return (
    <div>
      <h1> Browse Serials </h1>
      <Link to='/serials/create'> Create a Serial </Link>
    </div>
  );
};

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
);

const PrivateEditRoute = ({ component: Component, authStatus, clientUser, ...rest }) => (
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
);
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
              exact path={`${this.props.match.url}/`}
              component={SerialDirectory} />
            <Route
              path={`${this.props.match.url}/browse`}
              render={()=>
                <BrowseSerials />} />

            <PrivateRoute
              path={`${this.props.match.url}/create`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              component={CreateSerial} />

            <Route
              exact path={`${this.props.match.url}/:id`}
              render={()=>
                <SerialOverview clientUser={this.props.clientUser}/>} />
          </Switch>

          <Switch>
            <PrivateRoute
              exact path={`${this.props.match.url}/:id/:partId/edit`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              component={EditSerialPart} />

            <PrivateRoute
              path={`${this.props.match.url}/:id/new`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              component={CreateSerialPart} />

            <PrivateRoute
              path={`${this.props.match.url}/:id/edit`}
              authStatus={this.props.authStatus}
              clientUser={this.props.clientUser}
              component={EditSerial} />

            <Route
              path={`${this.props.match.url}/:id/:partId`}
              component={()=>
                <ViewSerialPart clientUser={this.props.clientUser}/>} />



          </Switch>

        </div>
      </div>
    );
  }
}
export default withRouter(Serials);
