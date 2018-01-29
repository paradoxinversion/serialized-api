import React from "react";
import {withRouter} from "react-router-dom";
import axios from "axios";

class EditSerial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      synopsis: props.synopsis,
      genre: props.genre,
      nsfw: props.nsfw
    };
    this.handleFormInput = this.handleFormInput.bind(this);
    axios.get(`/serials/${props.match.params.id}`)
      .then((serialData) => {
        this.state.title = serialData.data.serial.title;
        this.state.synopsis = serialData.data.serial.synopsis;
        this.state.genre = serialData.data.serial.genre;
      });
  }
  componentWillMount(){
    this.getSerialData();
  }
  handleFormInput(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value

    });
  }

  getSerialData(){
    const uri = `/serials/${this.props.match.params.id}`;
    fetch(uri,{
      mode: "cors",
      credentials: "include"
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          serial: result.serial,
        });
      });
  }

  async handleSerialSubmit(event){
    event.preventDefault();
    const uri = `/serials?serialId=${this.props.match.params.id}`;
    const data = {
      title: this.state.title,
      synopsis: this.state.synopsis,
      genre: this.state.genre,
      nsfw: this.state.nsfw
    };
    const configuration = {
      withCredentials: true
    };
    await axios.put(uri, data, configuration);
    const profile = {
      pathname: `/profile/${this.props.clientUser.username}`
    };
    this.props.history.push(profile);
  }


  render() {
    return (
      <div>
        <h1> Edit Serial </h1>
        <form onSubmit={this.handleSubmit}>
          <label >Title: <input name="title" type="text" value={this.state.title} onChange={this.handleFormInput} required/> </label>
          <label >Synopsis: <input name="synopsis" type="text" onChange={this.handleFormInput} required/> </label>
          <label >Genre: <input name="genre" type="text" onChange={this.handleFormInput} required/> </label>
          <label >NSFW: <input name="nsfw" type="checkbox" onChange={this.handleFormInput} required/> </label>
          <input type="submit" value="Submit" onClick={this.handleSerialSubmit.bind(this)} />
        </form>
      </div>

    );
  }
}

export default withRouter(EditSerial);
