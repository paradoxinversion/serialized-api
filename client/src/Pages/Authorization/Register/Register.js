import React from "react";
import PropTypes from "prop-types";
import handleRegistrationSubmission from "../../../utilityFunctions/registration/handleRegistrationSubmission";
import {
  withRouter,
  Link
} from "react-router-dom";

import {
  InputField,
  DatePicker
} from "../../../Components/Common/Forms/FormComponents";

import "../../../css/bulma.css";
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      birthdate: "1900-01-01",
      password: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
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

  async handleSubmit(event) {
    event.preventDefault();
    await handleRegistrationSubmission( this.state.email, this.state.username,
      this.state.firstName, this.state.lastName, this.state.birthdate,
      this.state.password
    );
    const logInPage = {
      pathname: `/auth/login`
    };
    this.props.history.push(logInPage);

  }

  render() {
    return (
      <div>
        <h1 className="title"> Register </h1>
        <h2 className="subtitle"> You&apos;re just a few steps away! </h2>
        <form onSubmit={this.handleSubmit}>
          <InputField name="email" title="Email" inputType="email"
            content={this.state.email} controlFunc={this.handleFormInput}
            placeholder="you@website.com" isRequired={true}/>
          <InputField name="username" title="Username" inputType="text"
            content={this.state.username} controlFunc={this.handleFormInput}
            placeholder="AwesomeAuthor" isRequired={true}/>
          <InputField name="firstName" title="First Name" inputType="text"
            content={this.state.firstName} controlFunc={this.handleFormInput}
            placeholder="Anne" isRequired={true}/>
          <InputField name="lastName" title="Last Name" inputType="text"
            content={this.state.lastName} controlFunc={this.handleFormInput}
            placeholder="Author" isRequired={true}/>
          <DatePicker name="birthdate" title="Birthdate" date={this.state.birthdate}
            controlFunc={this.handleFormInput} required={true} />
          <InputField name="password" title="Password" inputType="password"
            content={this.state.password} controlFunc={this.handleFormInput}
            placeholder="sOmeThingREALLYsecret" isRequired={true}/>
          <input className="button" type="submit" value="Submit" />
        </form>
        <p> Did you mean to <Link to="/auth/login">Log In</Link> instead?</p>
      </div>
    );
  }
}

Register.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(Register);
