import React from "react";
import PropTypes from "prop-types";
import handleRegistrationSubmission from "../../../utilityFunctions/registration/handleRegistrationSubmission";
import checkForRegisteredUsername from "../../../utilityFunctions/registration/checkForRegisteredUsername";
import checkForRegisteredEmail from "../../../utilityFunctions/registration/checkForRegisteredEmail";

import { withRouter, Link } from "react-router-dom";

import {
  InputField,
  DatePicker,
  CheckBox
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
      password: "",
      "password-confirmation": "",
      showPasswordMismatchWarning: false,
      showUsernameWarning: false,
      showEmailWarning: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormInput = this.handleFormInput.bind(this);
  }
  async handleFormInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    await this.setState({
      [name]: value
    });
    if (this.state.password !== this.state["password-confirmation"]) {
      await this.setState({
        showPasswordMismatchWarning: true
      });
    } else {
      await this.setState({
        showPasswordMismatchWarning: false
      });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.password === this.state["password-confirmation"]) {
      await handleRegistrationSubmission(
        this.state.email,
        this.state.username,
        this.state.firstName,
        this.state.lastName,
        this.state.birthdate,
        this.state.password
      );
      const logInPage = {
        pathname: `/auth/login`
      };
      this.props.history.push(logInPage);
    } else {
      this.setState({
        message: "Passwords do not match."
      });
    }
  }

  render() {
    const currentDate = new Date(Date.now());
    return (
      <main className="register">
        <header className="container">
          <h1> Register</h1>
        </header>
        <section className="container container--centered">
          <p>
            Your information is not sold to or shared with <strong>any</strong>{" "}
            third parties for any reason.
          </p>
          <form
            className="registration-form form form--standalone"
            onSubmit={this.handleSubmit}>
            <InputField
              name="email"
              inputType="email"
              content={this.state.email}
              controlFunc={this.handleFormInput}
              isRequired={true}
              title="Email"
              minLength={5}
              blurFunc={async () => {
                if (this.state.email.length >= 5 && this.state.email !== "") {
                  const emailAvailable = await checkForRegisteredEmail(
                    this.state.email
                  );
                  await this.setState({
                    showEmailWarning: !emailAvailable.data.emailAvailable
                  });
                }
              }}
            />
            {this.state.showEmailWarning ? (
              <p>Email is already in use, please try another</p>
            ) : null}
            <InputField
              name="username"
              inputType="text"
              content={this.state.username}
              controlFunc={this.handleFormInput}
              isRequired={true}
              title="Username"
              minLength={2}
              maxLength={32}
              blurFunc={async () => {
                if (
                  this.state.username.length >= 2 &&
                  this.state.username !== ""
                ) {
                  const usernameAvailable = await checkForRegisteredUsername(
                    this.state.username
                  );
                  await this.setState({
                    showUsernameWarning: !usernameAvailable.data
                      .usernameAvailable
                  });
                }
              }}
            />
            {this.state.showUsernameWarning ? (
              <p>Username is already exists, please try another</p>
            ) : null}
            <InputField
              name="firstName"
              inputType="text"
              content={this.state.firstName}
              controlFunc={this.handleFormInput}
              isRequired={true}
              title="First Name"
            />
            <InputField
              name="lastName"
              inputType="text"
              content={this.state.lastName}
              controlFunc={this.handleFormInput}
              isRequired={true}
              title="Last Name"
            />
            <DatePicker
              name="birthdate"
              date={this.state.birthdate}
              controlFunc={this.handleFormInput}
              required={true}
              title="Birthdate"
              min="1900-01-01"
              max={`${currentDate.getFullYear() - 13}-${currentDate.getMonth() +
                1}-${currentDate.getDate()}`}
            />
            <InputField
              name="password"
              inputType="password"
              content={this.state.password}
              controlFunc={this.handleFormInput}
              isRequired={true}
              title="Password"
              minLength={3}
              maxLength={32}
            />
            <InputField
              name="password-confirmation"
              inputType="password"
              content={this.state["password-confirmation"]}
              controlFunc={this.handleFormInput}
              isRequired={true}
              title="Password Confirmation"
            />
            {this.state.showPasswordMismatchWarning ? (
              <p>Passwords do not match</p>
            ) : null}
            <Link to="/auth/login">Did you mean to Sign In?</Link>
            <CheckBox isRequired="true" name="age-agreement" />
            <label htmlFor="age-agreement">
              Click this box if you are 13 years of age or older
            </label>
            <CheckBox isRequired="true" name="tos-agreement" />
            <label htmlFor="tos-agreement">
              Click this box if you have read and agree to Serialized&apos;s{" "}
              <Link to="/terms-of-service">Terms of Service</Link> and{" "}
              <Link to="/code-of-conduct">Code of Conduct</Link>
            </label>
            <input
              className="button button--primary"
              type="submit"
              value="Submit"
            />
          </form>
        </section>
      </main>
    );
  }
}

Register.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(Register);
