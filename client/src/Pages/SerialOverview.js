import React from 'react';
import queryString from 'query-string';
import {withRouter, Link} from 'react-router-dom'
import axios from 'axios';
import '../css/bulma.css'

const SerialPartList = withRouter((props) => {
  if (props.serialParts.length > 0){
    const serials = props.serialParts.map((serialPart) => {
      const uri = `/serials/${props.parentSerial._id}/${serialPart._id}`
      return (
        <li key={serialPart._id}>
          {/* <Link to={uri}>{serialPart.title}</Link> */}
          <Link to={{
            pathname: uri,
            state: {testState: "heckin mad"}
          }}>{serialPart.title}</Link>

          <button className="button is-small is-danger" onClick={async ()=>{
            await axios.delete(`/serials/${props.parentSerial._id}/${serialPart._id}`, {withCredentials: true});
            const dashboard = {
              pathname: '/dashboard'
            };
            props.history.push(dashboard);
          }}> Delete </button>
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
});

class SerialOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.match.params.id,
      serial: {},
      serialParts: []
    };
    console.log(props.location);
  }

  getSerialPartData(){
    const uri = `/serials/${this.state.query}`;
    fetch(uri,{
      mode: 'cors',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          serial: result.serial,
          serialParts: result.serialParts
        });
      });
  }
  componentDidMount(){
    console.log(this.props.location.state)
  }
  componentWillMount(){
    this.getSerialPartData();
  }

  render() {
    let newPartLink;
    let editPartLink;
    if (this.props.clientUser && this.props.clientUser.id === this.state.serial.author_id){
      newPartLink = <Link className="button" to={`/serials/${this.state.serial._id}/new`}> Create a New Part </Link>;
      editPartLink = <Link className="button" to={`/serials/${this.state.serial._id}/edit`}> Edit Serial Details </Link>;
    }

    return (
      <div>
        <h1 className="title"> {this.state.serial.title}</h1>
        <p> {this.state.serial.synopsis} </p>
        {newPartLink}
        {editPartLink}
        <SerialPartList parentSerial={this.state.serial} serialParts={this.state.serialParts}/>
      </div>
    );
  }
}

export default withRouter(SerialOverview);
