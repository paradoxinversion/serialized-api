import React from "react";
import {
  withRouter,
  Link
} from "react-router-dom";
import submitAuthentication from "../../../utilityFunctions/authentication/submitAuthentication";
import PropTypes from "prop-types";
import {
  InputField
} from "../../../Components/Common/Forms/FormComponents";
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
    try{
      await submitAuthentication(this.state.email, this.state.password);
      await this.props.onSignIn();
      const dashboard = {
        pathname: "/dashboard"
      };
      this.props.history.push(dashboard);
    } catch (e){
      console.error("Something went wrong: \n ", e);
    }
  }

  render() {
    return (
      <div className="log-in">
        <h1 className="title"> Welcome Back! </h1>
        <form className="log-in-form" onSubmit={this.handleSubmit}>
          <InputField name="email" inputType="email" content={this.state.email} controlFunc={this.handleFormInput} placeholder="email" />
          <InputField name="password" inputType="password" content={this.state.password} controlFunc={this.handleFormInput} placeholder="password"/>
          <Link to="/auth/register">Did you mean to Register?</Link>
          <input className="button button--primary" type="submit" value="Submit" />
        </form>

      </div>
    );
  }
}

LogIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(LogIn);
