import React from "react";
import PropTypes from "prop-types";
import deleteSerial from "../../../utilityFunctions/serials/deleteSerial";
import "./SerialList.css";
import SerialEntryContainer from "../../Containers/SerialEntryContainer/SerialEntryContainer";
class SerialList extends React.Component {
  constructor(props){
    super(props);
    this.deleteSerial = this.deleteSerial.bind(this);
  }

  async deleteSerial(serialId){
    await deleteSerial(serialId);
  }

  render(){
    let headerTextElement = null;
    if (this.props.headerText){
      headerTextElement = <h1 className="subtitle"> {this.props.headerText} </h1>;
    }
    if (this.props.serials &&  this.props.serials.length > 0){
      const serials = this.props.serials.map((serial) => {
        return (
          <li className="serial-list-item" key={serial._id}>
            <SerialEntryContainer
              clientUser={this.props.clientUser}
              serial={serial}
              goToSerial={this.props.goToSerial}
              onSerialDeleted={this.deleteSerial}/>
          </li>
        );
      });
      return (
        <div className="serial-list-container">
          {headerTextElement}
          <ul className="serial-list">{serials}</ul>
        </div>
      );
    } else{
      return(
        <div className="serial-list-container">
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
