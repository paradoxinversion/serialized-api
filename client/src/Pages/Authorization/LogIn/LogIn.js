import React from "react";
import {
  withRouter,
  Link
} from "react-router-dom";
import axios from "axios";
import submitAuthentication from "../../../utilityFunctions/authentication/submitAuthentication"
import PropTypes from "prop-types";
import {
  InputField
} from "../../../Components/Common/Forms/FormComponents";
import "../../../css/bulma-custom.css";
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
      // const uri = "/users/auth";
      // const data = {
      //   email: this.state.email,
      //   password: this.state.password
      // };
      // await axios.post(uri, data);
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
      <div>
        <h1 className="title"> Log In </h1>
        <h2 className="subtitle"> Please enter your login information </h2>
        <form onSubmit={this.handleSubmit}>
          <InputField name="email" title="Email" inputType="email" content={this.state.email} controlFunc={this.handleFormInput} placeholder="you@website.com" />
          <InputField name="password" title="Password" inputType="password" content={this.state.password} controlFunc={this.handleFormInput} />
          <input className="button is-primary2" type="submit" value="Submit" />
        </form>
        <p> Need to <Link to="/auth/register">Register</Link> instead?</p>
      </div>
    );
  }
}

LogIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(LogIn);
