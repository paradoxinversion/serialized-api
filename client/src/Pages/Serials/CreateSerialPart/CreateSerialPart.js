import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import handleSerialPartSubmission from "../../../utilityFunctions/serials/handleSerialPartSubmission";
import {
  InputField,
  QuillContainer
} from "../../../Components/Common/Forms/FormComponents";

class CreateSerialPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: ""
    };
    this.handleFormInput = this.handleFormInput.bind(this);
    this.handleQuillInput = this.handleQuillInput.bind(this);
  }
  async componentDidMount(){
    if (this.props.currentSerial === null || this.props.currentSerial._id !== this.props.match.params.id){
      await this.props.getSerialData(this.props.match.params.id);
    }
  }
  handleFormInput(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value

    });
  }

  handleQuillInput(quillContent){
    this.setState({
      content: quillContent
    });
  }

  async handleSerialPartSubmit(event){
    event.preventDefault();
    await handleSerialPartSubmission(this.props.currentSerial._id, this.state.title, this.state.content);
    const serial = {
      pathname: `/serials/${this.props.currentSerial._id}`
    };
    this.props.history.push(serial);

  }

  render() {
    const toolbarOptions = [ [{ "indent": "-1"}, { "indent": "+1" }],["bold", "italic", "underline", "strike"]];

    return (
      <div className="is-full-width">
        <h1> New Serial Part</h1>
        <form className="is-full-height" onSubmit={this.handleSubmit}>
          <InputField inputType="text" title="Title" name="title" controlFunc={this.handleFormInput} content={this.state.title} isRequired={true} />
          <button className="button is-primary" type="submit"  onClick={this.handleSerialPartSubmit.bind(this)}>Submit</button>
          <QuillContainer toolbarOptions={toolbarOptions} textChanged={this.handleQuillInput}/>
          
        </form>
      </div>

    );
  }
}

CreateSerialPart.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  currentSerial: PropTypes.object.isRequired,
  getSerialData: PropTypes.func
};

export default withRouter(CreateSerialPart);
