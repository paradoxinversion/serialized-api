import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import handleSerialPartEdit from "../../../utilityFunctions/serials/handleSerialPartEdit";
import {
  InputField,
  QuillContainer
} from "../../../Components/Common/Forms/FormComponents";
class EditSerialPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      part: null,
      title: "",
      content: "",
      newContent: "",
      contentLoaded: false
    };
    this.handleFormInput = this.handleFormInput.bind(this);
    this.handleQuillInput = this.handleQuillInput.bind(this);
  }

  handleFormInput(event) {
    if (event.target) {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    }
  }
  async componentDidMount() {
    if (
      this.props.currentSerial == null ||
      this.props.currentSerial._id !== this.props.match.params.id
    ) {
      await this.props.getSerialData(this.props.match.params.id);
    }
    await this.getSerialPart();
    this.setState({
      contentLoaded: true
    });
  }

  // This now exists outside of this function, switch it out
  async getSerialPart() {
    const uri = `/serials/${this.props.match.params.id}/${
      this.props.match.params.partId
    }`;
    const configuration = {
      withCredentials: true
    };
    const serialPartData = await axiosInstance.get(uri, configuration);
    this.setState({
      part: serialPartData.data.part,
      title: serialPartData.data.part.title,
      content: serialPartData.data.part.content
    });
  }

  handleQuillInput(quillContent) {
    this.setState({
      content: quillContent
    });
  }

  async handleSerialSubmit(event) {
    event.preventDefault();
    await handleSerialPartEdit(
      this.props.currentSerial._id,
      this.props.match.params.partId,
      this.state.title,
      this.state.content
    );
    const parentSerial = {
      pathname: `/serials/${this.props.currentSerial._id}`
    };
    this.props.history.push(parentSerial);
  }

  renderEditForm() {
    const toolbarOptions = [
      [{ indent: "-1" }, { indent: "+1" }],
      ["bold", "italic", "underline", "strike"]
    ];

    return (
      <section className="container container--centered">
        <h1 className="title"> Edit Serial </h1>
        <form
          className="form form--standalone form--full-height"
          onSubmit={this.handleSubmit}>
          <InputField
            inputType="text"
            title="Title"
            name="title"
            controlFunc={this.handleFormInput}
            content={this.state.title}
            isRequired={true}
          />
          <QuillContainer
            value={this.state.content}
            toolbarOptions={toolbarOptions}
            textChanged={this.handleQuillInput}
          />
          <input
            className="button button--primary"
            type="submit"
            value="Submit"
            onClick={this.handleSerialSubmit.bind(this)}
          />
        </form>
      </section>
    );
  }

  render() {
    // const toolbarOptions = [ [{ "indent": "-1"}, { "indent": "+1" }],["bold", "italic", "underline", "strike"]];
    return (
      <React.Fragment>
        {/* <section className="container container--centered">

          <h1 className="title"> Edit Serial </h1>
          <form className="form form--standalone form--full-height" onSubmit={this.handleSubmit}>
            <InputField inputType="text" title="Title" name="title" controlFunc={this.handleFormInput} content={this.state.title} isRequired={true} />
            <QuillContainer value={this.state.content} toolbarOptions={toolbarOptions} textChanged={this.handleQuillInput}/>
            <input className="button button--primary"type="submit" value="Submit" onClick={this.handleSerialSubmit.bind(this)} />


          </form>
        </section> */}
        {this.state.contentLoaded ? (
          this.renderEditForm()
        ) : (
          <section>
            <p> Loading </p>
          </section>
        )}
      </React.Fragment>
    );
  }
}

EditSerialPart.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(EditSerialPart);
