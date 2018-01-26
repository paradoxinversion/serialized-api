import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios';
import '../css/bulma.css';
class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    console.log(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormInput = this.handleFormInput.bind(this);
  }
  handleFormInput(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value

    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    try{
      const uri = "/users/auth";
      const data = {
        email: this.state.email,
        password: this.state.password
      };
      const loginResponse = await axios.post(uri, data);
      this.props.setUser(loginResponse.data.user);
      this.props.onSignIn(true);
      const dashboard = {
        pathname: '/dashboard'
      };
      this.props.history.push(dashboard);
    } catch (e){
      console.log("Something went wrong: \n ", e);
    }
  }

  render() {
    return (
      <div>
        <h1 className="title"> Log In </h1>
        <h2 className="subtitle"> Please enter your login information </h2>
        <form onSubmit={this.handleSubmit}>
          <label className="label">Email: <input className="input" name="email" type="email" placeholder="Email" onChange={this.handleFormInput}/> </label>
          <label className="label">Password: <input className="input" name="password" type="password" placeholder="Password" onChange={this.handleFormInput}/> </label>
          <input className="button" type="submit" value="Submit" />
        </form>
        <p> Need to <Link to="/auth/register">Register</Link> instead?</p>
      </div>
    );
  }
}

export default withRouter(LogIn);
