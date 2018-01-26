import React from 'react';
import queryString from 'query-string';
import {withRouter} from 'react-router-dom'
import axios from 'axios';

class CreateSerial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      synopsis: '',
      description: '',
      genre: '',
      nsfw: false
    };
    this.handleFormInput = this.handleFormInput.bind(this);
  }

  handleFormInput(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value

    });
  }

  async handleSerialSubmit(event){
    event.preventDefault();
    const uri = `/serials`;
    const data = {
      title: this.state.title,
      synopsis: this.state.synopsis,
      description: this.state.description,
      genre: this.state.genre,
      nsfw: this.state.nsfw
    };
    const configuration = {
      withCredentials: true
    };
    const submissionResponse = await axios.post(uri, data, configuration);
    const profile = {
      pathname: `/profile/${this.props.clientUser.username}`
    };
    this.props.history.push(profile);
  }


  render() {
    return (
      <div>
        <h1> New Serial </h1>
        <form onSubmit={this.handleSubmit}>
          <label >Title: <input className="input" name="title" type="text" onChange={this.handleFormInput} required/> </label>
          <label >Synopsis: <input className="input" name="synopsis" type="text" onChange={this.handleFormInput} required/> </label>
          <label >Description: <input className="input" name="description" type="text" onChange={this.handleFormInput} required/> </label>
          <label >Genre: <input className="input" name="genre" type="text" onChange={this.handleFormInput} required/> </label>
          <label >NSFW: <input className="checkbox" name="nsfw" type="checkbox" onChange={this.handleFormInput} required/> </label>
          <input className="button is-primary" type="submit" value="Submit" onClick={this.handleSerialSubmit.bind(this)} />
        </form>
      </div>

    );
  }
}

export default withRouter(CreateSerial);
