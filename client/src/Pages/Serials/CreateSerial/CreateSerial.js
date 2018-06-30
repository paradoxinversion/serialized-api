import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import handleSerialSubmission from "../../../utilityFunctions/serials/handleSerialSubmission";
import {
  InputField,
  CheckBox
} from "../../../Components/Common/Forms/FormComponents";
import "./CreateSerial.css";
class CreateSerial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      synopsis: "",
      genre: "",
      nsfw: false
    };
    this.handleFormInput = this.handleFormInput.bind(this);
  }

  handleFormInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  async handleSerialSubmit(event) {
    event.preventDefault();
    await handleSerialSubmission(
      this.state.title,
      this.state.synopsis,
      this.state.genre,
      this.state.nsfw
    );
    const profile = {
      pathname: `/users/${this.props.clientUser.username}`
    };
    this.props.history.push(profile);
  }

  render() {
    return (
      <main className="is-full-width">
        <header>
          <h1> New Serial </h1>
        </header>
        <section className="container container--centered">
          <form className="form form--standalone" onSubmit={this.handleSubmit}>
            <InputField
              inputType="text"
              title="Title"
              name="title"
              controlFunc={this.handleFormInput}
              content={this.state.title}
              isRequired={true}
            />
            <InputField
              inputType="text"
              title="Synopsis"
              name="synopsis"
              controlFunc={this.handleFormInput}
              content={this.state.synopsis}
              isRequired={true}
            />
            <InputField
              inputType="text"
              title="Genre"
              name="genre"
              controlFunc={this.handleFormInput}
              content={this.state.genre}
              isRequired={true}
            />
            <CheckBox
              title="NSFW"
              name="nsfw"
              controlFunc={this.handleFormInput}
              checked={this.state.nsfw}
            />
            <input
              className="button button--primary form__button--end"
              type="submit"
              value="Submit"
              onClick={this.handleSerialSubmit.bind(this)}
            />
          </form>
        </section>
      </main>
    );
  }
}

CreateSerial.propTypes = {
  clientUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(CreateSerial);
