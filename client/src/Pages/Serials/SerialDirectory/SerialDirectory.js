import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SerialList from "../../../Components/Common/SerialList/SerialList";
import "../../../css/bulma.css";

class SerialDirectory extends React.Component{
  constructor(props){
    super(props);
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
      console.error("Something went wrong: \n ", e);
    }
  }

  async componentWillMount(){
    // await this.getUserSerialData();
    await this.props.lookupSerials();
  }
  render () {
    let list;
    if (this.props.serials){
      list = (
        <SerialList
          emptyListMessage="No one has written any serials yet."
          serials={this.props.serials}
          toggleSerialSubscription={this.props.toggleSerialSubscription}/>
      );
    }else{
      list = (
        <p> Getting Serials... </p>
      );
    }
    return (
      <div>
        <h1 className="title">Directory</h1>
        <Link className="button is-primary" to='/serials/create'> Create a Serial </Link>
        {list}
      </div>
    );
  }
}

export default SerialDirectory;
