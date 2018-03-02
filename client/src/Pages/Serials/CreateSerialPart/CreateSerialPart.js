import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axios from "axios";
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
  async componentWillMount(){
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
    const uri = `/serials/${this.props.currentSerial._id}`;
    const data ={
      title: this.state.title,
      content: this.state.content
    };
    const configuration = {
      withCredentials: true
    };
    await axios.post(uri, data, configuration);
    const serial = {
      pathname: `/serials/${this.props.currentSerial._id}`
    };
    this.props.history.push(serial);

  }

  render() {
    const toolbarOptions = [ [{ "indent": "-1"}, { "indent": "+1" }],["bold", "italic", "underline", "strike"]];

    return (
      <div>
        <h1> New Serial Part</h1>
        <form onSubmit={this.handleSubmit}>
          <InputField inputType="text" title="Title" name="title" controlFunc={this.handleFormInput} content={this.state.title} isRequired={true} />
          <QuillContainer toolbarOptions={toolbarOptions} textChanged={this.handleQuillInput}/>
          <input className="button is-primary" type="submit" value="Submit" onClick={this.handleSerialPartSubmit.bind(this)} />
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
