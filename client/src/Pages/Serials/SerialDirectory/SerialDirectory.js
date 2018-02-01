import React from "react";
import {  withRouter, Link } from "react-router-dom";
import axios from "axios";
import SerialList from "../../../Components/Common/SerialList/SerialList";
import "../../../css/bulma.css";

// const SerialList = withRouter((props) => {
//   if (props.serials.length > 0){
//     const serials = props.serials.map((serial) => {
//       const uri = `/serials/${serial._id}`;
//       return (
//         <li key={serial._id}>
//           <Link to={{
//             pathname: uri,
//             state: {serialId: serial._id}
//           }}>{serial.title}</Link>
//
//         </li>
//       );
//     });
//     return (
//       <div>
//         <h1 className="subtitle"> Serials </h1>
//         <ul>{serials}</ul>
//       </div>
//     );
//   } else{
//     return <p> No has written any serials yet. Be the first one to tell your story. </p>;
//   }
// });

class SerialDirectory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      serials: {}
    };
  }

  async getUserSerialData(){
    console.log("getting serial data")
    try{
      const requestConfiguration = {
        withCredentials: true
      };
      const uri = `/serials`;
      const serialData = await axios.get(uri, requestConfiguration);
      this.setState({
        serials: serialData.data
      });
      console.log("done getting data")
    } catch (e){
      console.log("Something went wrong: \n ", e);
    }
  }

  async componentWillMount(){
    await this.getUserSerialData();
    console.log("will mount is done")
  }
  render () {
    return (
      <div>
        <h1 className="title">Directory</h1>
        <Link to='/serials/create'> Create a Serial </Link>
        <SerialList
          emptyListMessage="No one has written any serials yet."
          serials={this.state.serials} />
      </div>
    );
  }
}

export default SerialDirectory;
