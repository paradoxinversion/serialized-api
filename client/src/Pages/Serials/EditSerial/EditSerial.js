import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {
  InputField,
  CheckBox
} from "../../../Components/Common/Forms/FormComponents";
class EditSerial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.currentSerial.title,
      synopsis: props.currentSerial.synpopsis,
      genre: props.currentSerial.genre,
      nsfw: props.currentSerial.nsfw
    };
    this.handleFormInput = this.handleFormInput.bind(this);
  }

  handleFormInput(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value

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
      pathname: `/users/${this.props.clientUser.username}`
    };
    this.props.history.push(profile);
  }

  render() {
    return (
      <div>
        <h1> Edit Serial </h1>
        <form onSubmit={this.handleSubmit}>
          <InputField inputType="text" title="Title" name="title" controlFunc={this.handleFormInput} content={this.state.title} isRequired={true} />
          <InputField inputType="text" title="Synopsis" name="synopsis" controlFunc={this.handleFormInput} content={this.state.synopsis} isRequired={true} />
          <InputField inputType="text" title="Genre" name="genre" controlFunc={this.handleFormInput} content={this.state.genre} isRequired={true} />
          <CheckBox title="NSFW" name="nsfw" controlFunc={this.handleFormInput} checked={this.state.nsfw} />
          <input type="submit" value="Submit" onClick={this.handleSerialSubmit.bind(this)} />
        </form>
      </div>

    );
  }
}

EditSerial.propTypes = {
  clientUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(EditSerial);
