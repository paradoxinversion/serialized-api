import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
import axios from "axios";
import HTMLMarkupContainer from "../../../Components/Containers/HTMLMarkupContainer/HTMLMarkupContainer";
import SerialStepper from "../../../Components/SerialStepper/SerialStepper";
import "../../../css/bulma.css";

class ViewSerialPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parentSerial: {},
      serialPartData: {
        content: ""
      }
    };
  }

  async getSerialPartData(){
    const uri = `/serials/${this.props.match.params.id}/${this.props.match.params.partId}`;
    const configuration = {
      withCredentials: true
    };
    const serialPartData = await axios.get(uri, configuration);
    this.setState({
      parentSerial: serialPartData.data.parentSerial,
      serialPartData: serialPartData.data.part
    });
  }

  componentWillMount(){
    this.getSerialPartData();
    // this.props.getSerialData(this.props.match.params.id);
  }

  render() {
    const parentSerialUri = `/serials/${this.props.match.params.id}`;
    let partEditLink;
    if (this.props.clientUser && this.props.clientUser.id === this.state.parentSerial.author_id){
      partEditLink = <Link className="button level-item" to={`/serials/${this.props.match.params.id}/${this.props.match.params.partId}/edit`}> Edit </Link>;
    }

    return (
      <div className="container">
        <div className="level">
          <Link className="button level-item" to={parentSerialUri}>Back to {this.state.parentSerial.title}</Link>
          {partEditLink}
        </div>
        <h1 className="title"> {this.state.serialPartData.title}</h1>
        <HTMLMarkupContainer content={this.state.serialPartData.content} />
        <SerialStepper />
      </div>
    );
  }
}

ViewSerialPart.propTypes = {
  match: PropTypes.object.isRequired,
  clientUser: PropTypes.object
};

export default withRouter(ViewSerialPart);
