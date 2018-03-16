import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
import SerialPartList from "../../../Components/Common/SerialPartList/SerialPartList";
// import "../../../css/bulma.css";
import "./SerialOverview.css";

class SerialOverview extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount(){
    await this.props.getSerialData(this.props.match.params.id);

  }

  render() {
    if (this.props.currentSerial){
      let nsfw;
      if (this.props.currentSerial.nsfw){
        nsfw = ", NSFW";
      }

      return (
        <div className="serial-overview">
          <div className="serial-metadata">
            <div className="serial-metadata-info">
              <h1 className="title"> {this.props.currentSerial.title}</h1>
              <h2 className="subtitle">By <Link to={`/users/${this.props.currentSerial.author_id.username}`}>{this.props.currentSerial.author_id.username}</Link></h2>
              <p className="genre">{this.props.currentSerial.genre}{nsfw}</p>
              <p>{this.props.currentSerial.synopsis}</p>
            </div>
            <div className="serial-metadata-options right-aligned">
              {
                (this.props.clientUser && this.props.currentSerial.author_id && this.props.clientUser._id === this.props.currentSerial.author_id._id) ?
                  (
                    <React.Fragment>
                      <Link className="button level-item" to={`/serials/${this.props.currentSerial._id}/new`}> Create a New Part </Link>
                      <Link className="button level-item" to={`/serials/${this.props.currentSerial._id}/edit`}> Edit Serial Details </Link>
                    </React.Fragment>
                  ) :
                  null
              }
            </div>
          </div>



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
  getSerialData: PropTypes.func.isRequired,
  currentSerial: PropTypes.object
};

export default withRouter(SerialOverview);
