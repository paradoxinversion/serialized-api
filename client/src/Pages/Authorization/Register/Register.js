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
import "./Register.css";
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
      <div className="register">
        <header className="container">
          <h1 className="title"> Who are you? </h1>
        </header>
        <section className="container container--centered">
          <form className="registration-form form form--standalone" onSubmit={this.handleSubmit}>
            <InputField name="email" inputType="email"
              content={this.state.email} controlFunc={this.handleFormInput}
              placeholder="email" isRequired={true}/>
            <InputField name="username"inputType="text"
              content={this.state.username} controlFunc={this.handleFormInput}
              placeholder="username" isRequired={true}/>
            <InputField name="firstName" inputType="text"
              content={this.state.firstName} controlFunc={this.handleFormInput}
              placeholder="first name" isRequired={true}/>
            <InputField name="lastName" inputType="text"
              content={this.state.lastName} controlFunc={this.handleFormInput}
              placeholder="last name" isRequired={true}/>
            <DatePicker name="birthdate" date={this.state.birthdate}
              controlFunc={this.handleFormInput} required={true} />
            <InputField name="password" inputType="password"
              content={this.state.password} controlFunc={this.handleFormInput}
              placeholder="password" isRequired={true}/>
            <Link to="/auth/login">Did you mean to Sign In?</Link>
            <input className="button button--primary" type="submit" value="Submit" />
          </form>
        </section>
      </div>
    );
  }
}

Register.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(Register);
