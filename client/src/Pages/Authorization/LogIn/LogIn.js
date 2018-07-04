import React from "react";
import { withRouter, Link } from "react-router-dom";
import submitAuthentication from "../../../utilityFunctions/authentication/submitAuthentication";
import PropTypes from "prop-types";
import { InputField } from "../../../Components/Common/Forms/FormComponents";
import "./Login.css";
class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormInput = this.handleFormInput.bind(this);
  }

  handleFormInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      await submitAuthentication(this.state.email, this.state.password);
      await this.props.onSignIn();
      const dashboard = {
        pathname: "/dashboard"
      };
      this.props.history.push(dashboard);
    } catch (e) {
      console.error("Something went wrong: \n ", e);
    }
  }

  render() {
    return (
      <main className="log-in">
        <header className="container">
          <h1> Log In </h1>
        </header>
        <section className="container container--centered">
          <form
            className="log-in-form form form--standalone"
            onSubmit={this.handleSubmit}>
            <InputField
              name="email"
              inputType="email"
              content={this.state.email}
              controlFunc={this.handleFormInput}
              placeholder="email"
              autocomplete="email"
              title="Email Address"
            />
            <InputField
              name="password"
              inputType="password"
              content={this.state.password}
              controlFunc={this.handleFormInput}
              placeholder="password"
              autocomplete="current-password"
              title="Password"
            />
            <Link className="form__link form__link--end" to="/auth/register">
              Did you mean to Register?
            </Link>
            <input
              className="button button--primary form__button--center"
              type="submit"
              value="Submit"
            />
          </form>
        </section>
      </main>
    );
  }
}

LogIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(LogIn);
