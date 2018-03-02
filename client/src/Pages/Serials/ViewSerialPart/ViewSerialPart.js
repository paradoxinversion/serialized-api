import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
import HTMLMarkupContainer from "../../../Components/Containers/HTMLMarkupContainer/HTMLMarkupContainer";
import SerialStepper from "../../../Components/SerialStepper/SerialStepper";
import axios from "axios";
import "../../../css/bulma.css";

class ViewSerialPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      part: null
    };
  }

  async componentWillMount(){
    if (this.props.currentSerial == null || this.props.currentSerial._id !== this.props.match.params.id){
      await this.props.getSerialData(this.props.match.params.id);
    }
    await this.getSerialPart();
  }

  async getSerialPart(){
    const uri = `/serials/${this.props.match.params.id}/${this.props.match.params.partId}`;
    const configuration = {
      withCredentials: true
    };
    const serialPartData = await axios.get(uri, configuration);
    this.setState({
      part: serialPartData.data.part
    });
  }

  render() {
    if (this.state.part){
      const parentSerialUri = `/serials/${this.props.currentSerial._id}`;
      let partEditLink;
      if (this.props.clientUser && this.props.clientUser._id === this.props.currentSerial.author_id._id){
        partEditLink = <Link className="button level-item" to={`/serials/${this.props.currentSerial._id}/${this.state.part._id}/edit`}> Edit </Link>;
      }
      return (
        <div className="container">
          <div className="level">
            <Link className="button level-item" to={parentSerialUri}>Back to {this.props.currentSerial.title}</Link>
            {partEditLink}
          </div>
          <h1 className="title"> {this.state.part.title}</h1>
          <p>{`Part ${(this.state.part.part_number+1)}`} of {`${this.props.serialParts.length} in ${this.props.currentSerial.title}`}</p>
          <HTMLMarkupContainer content={this.state.part.content} />
          <SerialStepper currentSerial={this.props.currentSerial} currentPart={this.state.part} serialParts={this.props.serialParts}/>
        </div>
      );
    } else{
      return null;
    }
  }
}

ViewSerialPart.propTypes = {
  match: PropTypes.object.isRequired,
  clientUser: PropTypes.object,
  currentSerial: PropTypes.object,
  getSerialData: PropTypes.func,
  serialParts: PropTypes.array
};

export default withRouter(ViewSerialPart);
