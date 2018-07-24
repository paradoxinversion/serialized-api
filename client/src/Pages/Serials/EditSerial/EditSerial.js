import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import handleSerialEdit from "../../../utilityFunctions/serials/handleSerialEdit";
import {
  InputField,
  CheckBox,
  Select
} from "../../../Components/Common/Forms/FormComponents";
import getGenres from "../../../utilityFunctions/genres/getGenres";
class EditSerial extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      title: props.currentSerial.title,
      synopsis: props.currentSerial.synopsis,
      genre: props.currentSerial.genre,
      nsfw: props.currentSerial.nsfw,
      genreList: []
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
    await handleSerialEdit(
      this.props.match.params.id,
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
  async componentDidMount() {
    const genreListFetchResponse = await getGenres();
    await this.setState({
      genreList: genreListFetchResponse.data.genres
    });
  }
  render() {
    return (
      <main className="is-full-width">
        <header className="container">
          <h1> Edit Serial </h1>
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

            <Select
              inputType="text"
              title="Genre"
              name="genre"
              controlFunc={this.handleFormInput}
              isRequired={true}
              options={this.state.genreList}
            />
            <CheckBox
              title="NSFW"
              name="nsfw"
              controlFunc={this.handleFormInput}
              checked={this.state.nsfw}
            />
            <input
              className="button button--primary"
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

EditSerial.propTypes = {
  clientUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  currentSerial: PropTypes.object.isRequired
};

export default withRouter(EditSerial);
