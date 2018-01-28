import React from 'react';
import queryString from 'query-string';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

class CreateSerialPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: queryString.parse(props.location.search),
      parentSerial: {},
      title: '',
      content: ''
    };
    this.handleFormInput = this.handleFormInput.bind(this);

  }

  async getSerialData(){
    const parentSerial = await axios.get(`/serials/${this.props.match.params.id}`);
    this.setState({
      parentSerial: parentSerial.data
    });
  }

  componentDidMount(){
  }
  componentWillMount(){
    this.getSerialData();
  }
  handleFormInput(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value

    });
  }


  async handleSerialPartSubmit(event){
    event.preventDefault();
    const uri = `/serials/${this.state.parentSerial.serial._id}`;
    const data ={
      title: this.state.title,
      content: this.state.content
    };
    const configuration = {
      withCredentials: true
    };
    const partSubmissionResult = await axios.post(uri, data, configuration);
    const serial = {
      pathname: `/serials/${this.state.parentSerial.serial._id}`
    };
    this.props.history.push(serial);

  }


  render() {
    return (
      <div>
        <h1> New Serial Part</h1>
        <form onSubmit={this.handleSubmit}>
          <label className="label">Title: <input className="input" name="title" type="text" onChange={this.handleFormInput}/> </label>
          <label className="label">Content: <textarea className="textarea" name="content" type="text" onChange={this.handleFormInput}/> </label>
          <input className="button is-primary" type="submit" value="Submit" onClick={this.handleSerialPartSubmit.bind(this)} />
        </form>
      </div>

    );
  }
}

export default withRouter(CreateSerialPart);
