import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios';

class EditSerial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      content: props.content
    };
    this.handleFormInput = this.handleFormInput.bind(this);
    // axios.get(`/serials/${props.match.params.id}/${props.match.params.partId}`)
    //   .then((serialPartData) => {
    //     this.state.title = serialPartData.data.serial.title;
    //     this.state.content = serialPartData.data.serial.content;
    //   });
  }

  componentWillMount(){
    this.getSerialPartData();
  }

  handleFormInput(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value

    });
  }

  async getSerialPartData(){
    const uri = `/serials/${this.props.match.params.id}/${this.props.match.params.partId}`;
    const configuration = {
      withCredentials: true
    }
    const serialPartData = await axios.get(uri, configuration);
    console.log(serialPartData);
    this.setState({
      parentSerial: serialPartData.data.parentSerial,
      serialPartData: serialPartData.data.part
    })
  }

  async handleSerialSubmit(event){
    event.preventDefault();
    const uri = `/serials/${this.props.match.params.id}/?partId=${this.props.match.params.partId}`;
    const data = {
      title: this.state.title,
      content: this.state.content,
    };
    const configuration = {
      withCredentials: true
    };
    await axios.put(uri, data, configuration);
    const parentSerial = {
      pathname: `/serials/${this.props.match.params.id}`
    };
    this.props.history.push(parentSerial);
  }


  render() {
    console.log(this.state.parentSerial);
    return (
      <div>
        <h1> Edit Serial </h1>
        <form onSubmit={this.handleSubmit}>
          <label >Title: <input name="title" type="text" value={this.state.title} onChange={this.handleFormInput} required/> </label>
          <label >Content: <input name="content" type="text" onChange={this.handleFormInput} required/> </label>
          <input type="submit" value="Submit" onClick={this.handleSerialSubmit.bind(this)} />
        </form>
      </div>

    );
  }
}

export default withRouter(EditSerial);
