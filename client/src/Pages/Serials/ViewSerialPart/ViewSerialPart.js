import React from 'react';
import {withRouter, Link} from 'react-router-dom'
import axios from 'axios';
import '../../../css/bulma.css';

class ViewSerialPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.match.params.id,
      parentSerial: {},
      serialPartData: {}
    };
  }

  // Get the obj for a single serial part
  async getSerialPartData(){
    const uri = `/serials/${this.props.match.params.id}/${this.props.match.params.partId}`;
    const configuration = {
      withCredentials: true
    }
    const serialPartData = await axios.get(uri, configuration);
    this.setState({
      parentSerial: serialPartData.data.parentSerial,
      serialPartData: serialPartData.data.part
    })
  }

  componentWillMount(){
    this.getSerialPartData();
  }

  render() {
    const parentSerialUri = `/serials/${this.props.match.params.id}`
    let partEditLink;
    if (this.props.clientUser && this.props.clientUser.id === this.state.parentSerial.author_id){
      partEditLink = <Link className="button level-item" to={`/serials/${this.props.match.params.id}/${this.props.match.params.partId}/edit`}> Edit </Link>
    }
    return (
      <div>
        <div className="level">
          <Link className="button level-item" to={parentSerialUri}>Back to {this.state.parentSerial.title}</Link>
          {partEditLink}
        </div>
        <h1 className="title"> {this.state.serialPartData.title}</h1>
        <section className="section">
          <p> {this.state.serialPartData.content}</p>
        </section>
      </div>
    );
  }
}

export default withRouter(ViewSerialPart);
