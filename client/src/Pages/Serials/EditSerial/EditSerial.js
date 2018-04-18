import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import handleSerialEdit from "../../../utilityFunctions/serials/handleSerialEdit";
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
    await handleSerialEdit(this.props.match.params.id, this.state.title, this.state.synopsis, this.state.genre, this.state.nsfw);
    const profile = {
      pathname: `/users/${this.props.clientUser.username}`
    };
    this.props.history.push(profile);
  }

  render() {
    return (
      <div className="is-full-width">
        <header className="container">
          <h1> Edit Serial </h1>
        </header>
        <section className="container container--centered">
          <form className="form form--standalone" onSubmit={this.handleSubmit}>
            <InputField inputType="text" title="Title" name="title" controlFunc={this.handleFormInput} content={this.state.title} isRequired={true} />
            <InputField inputType="text" title="Synopsis" name="synopsis" controlFunc={this.handleFormInput} content={this.state.synopsis} isRequired={true} />
            <InputField inputType="text" title="Genre" name="genre" controlFunc={this.handleFormInput} content={this.state.genre} isRequired={true} />
            <CheckBox title="NSFW" name="nsfw" controlFunc={this.handleFormInput} checked={this.state.nsfw} />
            <input className="button button--primary" type="submit" value="Submit" onClick={this.handleSerialSubmit.bind(this)} />
          </form>
        </section>
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
