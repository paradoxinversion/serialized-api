import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import axios from "axios";
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
      content: ""
    };
    this.handleFormInput = this.handleFormInput.bind(this);
    this.handleQuillInput = this.handleQuillInput.bind(this);
  }

  handleFormInput(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  async componentWillMount(){
    if (this.props.currentSerial == null || this.props.currentSerial._id !== this.props.match.params.id){
      await this.props.getSerialData(this.props.match.params.id);
    }
    await this.getSerialPart();
  }

  // This now exists outside of this function, switch it out
  async getSerialPart(){
    const uri = `/serials/${this.props.match.params.id}/${this.props.match.params.partId}`;
    const configuration = {
      withCredentials: true
    };
    const serialPartData = await axios.get(uri, configuration);
    this.setState({
      part: serialPartData.data.part,
      title: serialPartData.data.part.title,
      content: serialPartData.data.part.content
    });

  }

  handleQuillInput(quillContent){
    this.setState({
      content: quillContent
    });
  }

  async handleSerialSubmit(event){
    event.preventDefault();
    await handleSerialPartEdit(this.props.currentSerial._id, this.props.match.params.partId, this.state.title, this.state.content);
    const parentSerial = {
      pathname: `/serials/${this.props.currentSerial._id}`
    };
    this.props.history.push(parentSerial);
  }

  render() {
    const toolbarOptions = [ [{ "indent": "-1"}, { "indent": "+1" }],["bold", "italic", "underline", "strike"]];
    return (
      <div>
        <h1> Edit Serial </h1>
        <form onSubmit={this.handleSubmit}>
          <InputField inputType="text" title="Title" name="title" controlFunc={this.handleFormInput} content={this.state.title} isRequired={true} />
          <QuillContainer value={this.state.content} toolbarOptions={toolbarOptions} textChanged={this.handleQuillInput}/>
          <input type="submit" value="Submit" onClick={this.handleSerialSubmit.bind(this)} />
        </form>
      </div>
    );
  }
}

EditSerialPart.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(EditSerialPart);
