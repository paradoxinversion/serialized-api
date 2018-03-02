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
    let headerTextElement = null;
    if (this.props.headerText){
      headerTextElement = <h1 className="subtitle"> {this.props.headerText} </h1>;
    }
    if (this.props.serials &&  this.props.serials.length > 0){
      const serials = this.props.serials.map((serial) => {
        return (
          <li key={serial._id}>
            <SerialEntryContainer
              clientUser={this.props.clientUser}
              serial={serial}
              goToSerial={this.props.goToSerial}
              onSerialDeleted={this.deleteSerial}/>
          </li>
        );
      });
      return (
        <div>
          {headerTextElement}
          <ul>{serials}</ul>
        </div>
      );
    } else{
      return(
        <div>
          {headerTextElement}
          <p>{this.props.emptyListMessage}</p>
        </div>
      );
    }
  }
}

SerialList.propTypes = {
  serials: PropTypes.array.isRequired,
  emptyListMessage: PropTypes.string.isRequired,
  headerText: PropTypes.string,
  getProfileData: PropTypes.func,
  clientUser: PropTypes.object,
  goToSerial: PropTypes.func
};
export default SerialList;
