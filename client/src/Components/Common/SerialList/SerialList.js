import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import SerialEntryContainer from "../../Containers/SerialEntryContainer/SerialEntryContainer";
class SerialList extends React.Component {
  constructor(props){
    super(props);
    this.deleteSerial = this.deleteSerial.bind(this);
  }
  async deleteSerial(serialId){
    await axios.delete(`/serials?serialId=${serialId}`, {
      withCredentials: true
    });
    await this.props.getProfileData();
  }
  
  render(){
    if (this.props.serials &&  this.props.serials.length > 0){
      const serials = this.props.serials.map((serial) => {
        const uri = `/serials/${serial._id}`;
        return (
          <li key={serial._id}>
            <SerialEntryContainer
              clientUser={this.props.clientUser}
              serial={serial}
              goToSerial={this.props.goToSerial}
              serialUri={uri}
              onSerialDeleted={this.deleteSerial}/>
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

};
SerialList.propTypes = {
  serials: PropTypes.array.isRequired,
  emptyListMessage: PropTypes.string.isRequired
};
export default SerialList;
