import React from "react";
import {  withRouter, Link } from "react-router-dom";
import axios from "axios";
import "../../../css/bulma.css";

const SerialList = withRouter((props) => {
  if (props.serials.length > 0){
    const serials = props.serials.map((serial) => {
      const uri = `/serials/${serial._id}`;
      return (
        <li key={serial._id}>
          <Link to={{
            pathname: uri
          }}>{serial.title}</Link>

        </li>
      );
    });
    return (
      <div>
        <h1 className="subtitle"> Serials </h1>
        <ul>{serials}</ul>
      </div>
    );
  } else{
    return <p> No has written any serials yet. Be the first one to tell your story. </p>;
  }
});

class SerialDirectory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      serials: {}
    };
  }

  async getUserSerialData(){
    try{
      const requestConfiguration = {
        withCredentials: true
      };
      const uri = `/serials`;
      const serialData = await axios.get(uri, requestConfiguration);
      this.setState({
        serials: serialData.data
      });
    } catch (e){
      console.log("Something went wrong: \n ", e);
    }
  }

  componentWillMount(){
    this.getUserSerialData();
  }
  render () {
    return (
      <div>
        <h1 className="title">Directory</h1>
        <SerialList serials={this.state.serials} />
      </div>
    );
  }
}

export default SerialDirectory;
