import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SerialList from "../../../Components/Common/SerialList/SerialList";
import "../../../css/bulma.css";

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
      console.error("Something went wrong: \n ", e);
    }
  }

  async componentWillMount(){
    await this.getUserSerialData();
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
