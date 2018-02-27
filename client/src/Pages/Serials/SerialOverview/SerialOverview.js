import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
import SerialPartList from "../../../Components/Common/SerialPartList/SerialPartList";
import "../../../css/bulma.css";
import "./SerialOverview.css";

class SerialOverview extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount(){
    console.log("Serial Overview Mounted");
    await this.props.getSerialData(this.props.match.params.id);

  }

  render() {
    if (this.props.currentSerial){
      let authorControls;
      let nsfw;
      if (this.props.currentSerial.nsfw){
        nsfw = ", NSFW";
      }
      if (this.props.clientUser && this.props.currentSerial.author_id && this.props.clientUser._id === this.props.currentSerial.author_id._id){
        authorControls = (
          <div className="level">
            <Link className="button level-item" to={`/serials/${this.props.currentSerial._id}/new`}> Create a New Part </Link>
            <Link className="button level-item" to={`/serials/${this.props.currentSerial._id}/edit`}> Edit Serial Details </Link>
          </div>
        );
      }
      return (
        <div>
          <h1 className="title"> {this.props.currentSerial.title}</h1>
          <h2 className="subtitle">By <Link to={`/users/${this.props.currentSerial.author_id.username}`}>{this.props.currentSerial.author_id.username}</Link></h2>
          <p className="genre">{this.props.currentSerial.genre}{nsfw}</p>
          <p>{this.props.currentSerial.synopsis}</p>
          {authorControls}
          <hr className="horizontal-rule" />
          <SerialPartList getSerialData={this.props.getSerialData} clientUser={this.props.clientUser} currentSerial={this.props.currentSerial} serialParts={this.props.serialParts}/>
        </div>
      );
    } else {
      return (
        <h1> Loading Serial Data... </h1>
      );
    }
  }
}

SerialOverview.propTypes = {
  clientUser: PropTypes.object,
  match: PropTypes.object.isRequired,
  serial: PropTypes.object,
  serialParts: PropTypes.array,
  getSerialData: PropTypes.func.isRequired
};

export default withRouter(SerialOverview);
