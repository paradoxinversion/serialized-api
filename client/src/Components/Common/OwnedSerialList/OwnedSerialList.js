import React from "react";
import PropTypes from "prop-types";
import {
  withRouter
} from "react-router-dom";
import axios from "axios";
import OwnedSerialEntryContainer from "../../Containers/OwnedSerialEntryContainer/OwnedSerialEntryContainer";
class OwnedSerialList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userSerials: []
    };
    this.getUserSerialData = this.getUserSerialData.bind(this);
    this.deleteSerialPart = this.deleteSerialPart.bind(this);
  }
  async componentWillMount(){
    await this.getUserSerialData();
  }
  async getUserSerialData(){
    try{
      const requestConfiguration = {
        withCredentials: true
      };
      const uri = `/serials?userId=${this.props.clientUser._id}`;
      const serialData = await axios.get(uri, requestConfiguration);
      this.setState({
        userSerials: serialData.data
      });
    } catch (e){
      console.error("Something went wrong: \n ", e);
    }
  }

  async deleteSerialPart(serialId){
    const deletionResult = await axios.delete(`/serials?serialId=${serialId}`, {
      withCredentials: true
    });
    console.log("deletion", deletionResult);
    await this.getUserSerialData();
  }

  render(){

    if (this.state.userSerials.length > 0){
      const serials = this.state.userSerials.map((serial) => {
        const uri = `/serials/${serial._id}`;
        return (
          <li key={serial._id}>

            <OwnedSerialEntryContainer
              serial={serial}
              serialUri={uri}
              onSerialDeleted={this.deleteSerialPart}/>
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
      return <p>{this.props.emptyListMessage}</p>;
    }

  }
}
OwnedSerialList.propTypes = {
  serials: PropTypes.object.isRequired,
  emptyListMessage: PropTypes.string.isRequired
};
export default OwnedSerialList;
