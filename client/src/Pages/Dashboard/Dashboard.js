import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";

import axios from "axios";
// import SerialList from "../../Components/Common/SerialList/SerialList";
import OwnedSerialList from "../../Components/Common/OwnedSerialList/OwnedSerialList";
import "./Dashboard.css";
// const SerialList = withRouter((props) => {
//   if (props.serials.length > 0){
//     const serials = props.serials.map((serial) => {
//       const serialuri = `/serials/${serial._id}`;
//       return (
//         <li key={serial._id}>
//           <Link className="serial-link" to={serialuri}>{serial.title}</Link>
//           <button className="button is-danger is-small" onClick={async ()=>{
//             await axios.delete(`/serials?serialId=${serial._id}`, {withCredentials: true});
//             const dashboard = {
//               pathname: "/dashboard"
//             };
//             props.history.push(dashboard);
//           }}> Delete </button>
//         </li>
//       );
//     });
//
//     return (
//       <div>
//         <h2 className="subtitle"> My Serials </h2>
//         <ul>{serials}</ul>
//       </div>
//     );
//   } else{
//     return <p> You have not written any serials. </p>;
//   }
// });
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSerials: []
    };

  }
  componentDidMount(){


  }
  async componentWillMount(){
    console.log(this.props)
    await this.props.checkAuthentication();
    await this.getUserSerialData();
    console.log(this.state.userSerials);
  }

  async getUserSerialData(){
    try{
      const requestConfiguration = {
        withCredentials: true
      };
      const uri = `/serials?userId=${this.props.clientUser._id}`;
      const serialData = await axios.get(uri, requestConfiguration);
      console.log(serialData);
      this.setState({
        userSerials: serialData.data
      });
    } catch (e){
      console.error("Something went wrong: \n ", e);
    }
  }

  render() {
    return (
      <div>
        <h1 className="title is-4"> Welcome back, {this.props.clientUser.username} </h1>
        <div className="level">
          <Link className="button level-item" to={`/users/${this.props.clientUser.username}`}> Profile </Link>
        </div>
        <OwnedSerialList serials={this.state.userSerials} emptyListMessage="You have not written any serials" />
        {/* <SerialList onDelete={this.getUserSerialData} history={this.props.history} serials={this.state.userSerials}/> */}
      </div>
    );
  }
}

Dashboard.propTypes = {
  checkAuthentication: PropTypes.func.isRequired,
  clientUser: PropTypes.object.isRequred,
  history: PropTypes.object.isRequired
};

export default Dashboard;
