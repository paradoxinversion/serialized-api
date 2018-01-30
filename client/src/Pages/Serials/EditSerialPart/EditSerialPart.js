import React from "react";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {
  InputField
} from "../../../Components/Common/Forms/FormComponents";
class EditSerial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: ""
    };
    this.handleFormInput = this.handleFormInput.bind(this);
  }

  componentWillMount(){
    this.getSerialPartData();
  }

  handleFormInput(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value

    });
  }

  async getSerialPartData(){
    const uri = `/serials/${this.props.match.params.id}/${this.props.match.params.partId}`;
    const configuration = {
      withCredentials: true
    };
    const serialPartData = await axios.get(uri, configuration);
    this.setState({
      parentSerial: serialPartData.data.parentSerial,
      serialPartData: serialPartData.data.part
    });
  }

  async handleSerialSubmit(event){
    event.preventDefault();
    const uri = `/serials/${this.props.match.params.id}/?partId=${this.props.match.params.partId}`;
    const data = {
      title: this.state.title,
      content: this.state.content,
    };
    const configuration = {
      withCredentials: true
    };
    await axios.put(uri, data, configuration);
    const parentSerial = {
      pathname: `/serials/${this.props.match.params.id}`
    };
    this.props.history.push(parentSerial);
  }


  render() {
    return (
      <div>
        <h1> Edit Serial </h1>
        <form onSubmit={this.handleSubmit}>
          <InputField inputType="text" title="Title" name="title" controlFunc={this.handleFormInput} content={this.state.title} isRequired={true} />
          <InputField inputType="text" title="Content" name="title" controlFunc={this.handleFormInput} content={this.state.content} isRequired={true} />
          <input type="submit" value="Submit" onClick={this.handleSerialSubmit.bind(this)} />
        </form>
      </div>

    );
  }
}

export default withRouter(EditSerial);
