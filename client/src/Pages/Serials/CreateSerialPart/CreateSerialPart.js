import React from "react";
import queryString from "query-string";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {
  InputField,
  QuillContainer
} from "../../../Components/Common/Forms/FormComponents";

class CreateSerialPart extends React.Component {
  constructor(props) {
    console.log(props)
    super(props);
    this.state = {
      query: queryString.parse(props.location.search),
      parentSerial: {},
      title: "",
      content: ""
    };
    this.handleFormInput = this.handleFormInput.bind(this);
    this.handleQuillInput = this.handleQuillInput.bind(this);
  }

  async getSerialData(){
    const parentSerial = await axios.get(`/serials/${this.props.match.params.id}`);
    this.setState({
      parentSerial: parentSerial.data
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
  handleQuillInput(quillContent){
    this.setState({
      content: quillContent
    });
  }

  async handleSerialPartSubmit(event){
    event.preventDefault();
    const uri = `/serials/${this.state.parentSerial.serial._id}`;
    const data ={
      title: this.state.title,
      content: this.state.content
    };
    const configuration = {
      withCredentials: true
    };
    await axios.post(uri, data, configuration);
    const serial = {
      pathname: `/serials/${this.state.parentSerial.serial._id}`
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
          {/* <InputField inputType="text" title="Content" name="title" controlFunc={this.handleFormInput} content={this.state.content} isRequired={true} /> */}
          <QuillContainer toolbarOptions={toolbarOptions} textChanged={this.handleQuillInput}/>
          <input className="button is-primary" type="submit" value="Submit" onClick={this.handleSerialPartSubmit.bind(this)} />
        </form>
      </div>

    );
  }
}

export default withRouter(CreateSerialPart);
