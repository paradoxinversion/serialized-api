import React from "react";
import PropTypes from "prop-types";
import deleteSerial from "../../../utilityFunctions/serials/deleteSerial";
import "./SerialList.css";
import SerialEntryContainer from "../../Containers/SerialEntryContainer/SerialEntryContainer";
class SerialList extends React.Component {
  constructor(props) {
    super(props);
    this.deleteSerial = this.deleteSerial.bind(this);
  }

  async deleteSerial(serialId) {
    await deleteSerial(serialId);
  }

  render() {
    return (
      <div className="serial-list-container">
        {this.props.serials && this.props.serials.length > 0 ? (
          <ul className="serial-list">
            {this.props.serials.map(serial => (
              <li className="serial-list-item" key={serial._id}>
                <SerialEntryContainer
                  clientUser={this.props.clientUser}
                  serial={serial}
                  goToSerial={this.props.goToSerial}
                  onSerialDeleted={this.deleteSerial}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>{this.props.emptyListMessage}</p>
        )}
      </div>
    );
  }
}
SerialList.defaultProps = {
  name: "Stranger"
};
SerialList.propTypes = {
  serials: PropTypes.array.isRequired,
  emptyListMessage: PropTypes.string.isRequired,
  getProfileData: PropTypes.func,
  clientUser: PropTypes.object,
  goToSerial: PropTypes.func
};
export default SerialList;
