import React from "react";
import {
  withRouter
} from "react-router-dom";
import axios from "axios";
import SerialPartEntryContainer from "../../Containers/SerialPartEntryContainer/SerialPartEntryContainer";

class SerialPartList extends React.Component {
  constructor(props){
    super(props);
    this.deleteSerialPart = this.deleteSerialPart.bind(this);
  }

  async deleteSerialPart(serialId, partId){
    const deletionResult = await axios.delete(`/serials/${serialId}/${partId}`, {
      withCredentials: true
    });
    console.log("deletion", deletionResult);
    await this.props.getSerialData(serialId);
  }

  render(){
    if (this.props.serialParts.length > 0){
      const serials = this.props.serialParts.map((serialPart) => {
        const uri = `/serials/${this.props.currentSerial._id}/${serialPart._id}`;
        return (
          <li key={serialPart._id}>
            <SerialPartEntryContainer onSerialPartDeleted={this.deleteSerialPart} clientUser={this.props.clientUser} currentSerial={this.props.currentSerial} serialPart={serialPart} serialPartUri={uri} />
          </li>
        );
      });
      return (
        <div>
          <h1 className="subtitle"> Parts </h1>
          <ul>{serials}</ul>
        </div>
      );
    } else{
      return <p> There are not any parts for this serial yet. </p>;
    }
  }

};

export default SerialPartList;
