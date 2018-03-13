import React from "react";
import {
  withRouter
} from "react-router-dom";
import axios from "axios";
import moveSerialPart from "../../../utilityFunctions/moveSerialPart";
import SerialPartEntryContainer from "../../Containers/SerialPartEntryContainer/SerialPartEntryContainer";

/// A list representing all parts of a serial story
class SerialPartList extends React.Component {
  constructor(props){
    super(props);
    this.deleteSerialPart = this.deleteSerialPart.bind(this);
    this.movePart = this.movePart.bind(this);
  }

  async deleteSerialPart(serialId, partId){
    try{
      await Promise.all([await axios.delete(`/serials/${serialId}/${partId}`, {
        withCredentials: true
      }),
      await this.props.getSerialData(serialId)])
    } catch (e) {
      console.log(e);
      throw e;
    }

  }
  async movePart(partId, up){
    try{
      await Promise.all([await moveSerialPart(this.props.currentSerial._id, partId, up),
        await this.props.getSerialData(this.props.currentSerial._id)]);
    } catch (e){
      console.log(e);
      throw e;
    }

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
