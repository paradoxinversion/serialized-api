import React from "react";
import {
  withRouter
} from "react-router-dom";
import axios from "axios";
import SerialPartEntryContainer from "../../Containers/SerialPartEntryContainer/SerialPartEntryContainer";

/// A list representing all parts of a serial story
class SerialPartList extends React.Component {
  constructor(props){
    super(props);
    this.deleteSerialPart = this.deleteSerialPart.bind(this);
    this.movePart = this.movePart.bind(this);
  }

  async deleteSerialPart(serialId, partId){
    const deletionResult = await axios.delete(`/serials/${serialId}/${partId}`, {
      withCredentials: true
    });
    await this.props.getSerialData(serialId);
  }
  async movePart(partId, up){
    const payload = {
      moveUp: up
    }
    const movementResult = await axios.put(`/serials/${this.props.currentSerial._id}/${partId}`, payload, {withCredentials: true});
    await this.props.getSerialData(this.props.currentSerial._id);
  }
  render(){
    if (this.props.serialParts.length > 0){
      const serials = this.props.serialParts.map((serialPart) => {
        const uri = `/serials/${this.props.currentSerial._id}/${serialPart._id}`;
        return (
          <li key={serialPart.part_number}>
            <SerialPartEntryContainer
              onSerialPartDeleted={this.deleteSerialPart}
              onPartMoved={this.movePart}
              clientUser={this.props.clientUser}
              currentSerial={this.props.currentSerial}
              serialPart={serialPart}
              serialPartUri={uri}
              serialParts={this.props.serialParts}/>
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
