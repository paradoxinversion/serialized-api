import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import axios from "axios";
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

  async getSerialPart(){
    const uri = `/serials/${this.props.match.params.id}/${this.props.match.params.partId}`;
    const configuration = {
      withCredentials: true
    };
    const serialPartData = await axios.get(uri, configuration);
    this.setState({
      part: serialPartData.data.part
    });
  }
  // async getSerialPartData(){
  //   const uri = `/serials/${this.props.currentSerial._id}/${this.props.match.params.partId}`;
  //   const configuration = {
  //     withCredentials: true
  //   };
  //   const serialPartData = await axios.get(uri, configuration);
  //   this.setState({
  //     parentSerial: serialPartData.data.parentSerial,
  //     serialPartData: serialPartData.data.part
  //   });
  // }
  handleQuillInput(quillContent){
    this.setState({
      content: quillContent
    });
  }

  async handleSerialSubmit(event){
    event.preventDefault();
    const uri = `/serials/${this.props.currentSerial._id}/?partId=${this.props.match.params.partId}`;
    const data = {
      title: this.state.title,
      content: this.state.content,
    };
    const configuration = {
      withCredentials: true
    };
    await axios.put(uri, data, configuration);
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
