import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import '../css/bulma.css';
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      username: null,
      firstName: null,
      lastName: null,
      birthdate: null,
      password: null
    };

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

  handleSubmit(event) {
    fetch ('/users', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: this.state.email,
        username: this.state.username,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        birthdate: this.state.birthdate,
        password: this.state.password
      })
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {

        const logInPage = {
          pathname: `/auth/login`
        };
        this.props.history.push(logInPage);
      });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h1 className="title"> Register </h1>
        <h2 className="subtitle"> You&apos;re just a few steps away! </h2>
        <form onSubmit={this.handleSubmit}>
          <label className="label">Email: <input className="input" name="email" type="email" placeholder="Email" onChange={this.handleFormInput} required/> </label>
          <label className="label">Username: <input className="input" name="username" type="text" placeholder="Username" onChange={this.handleFormInput} required/> </label>
          <label className="label">First Name: <input className="input" name="firstName" type="text" placeholder="First Name" onChange={this.handleFormInput} required/> </label>
          <label className="label">Last Name: <input className="input" name="lastName" type="text" placeholder="Last Name" onChange={this.handleFormInput} required/> </label>
          <label className="label">Birthdate: <input className="input" name="birthdate" type="date" onChange={this.handleFormInput} required/> </label>
          <label className="label">Password: <input className="input" name="password" type="password" placeholder="Password" onChange={this.handleFormInput} required/> </label>
          <input className="button" type="submit" value="Submit" />
        </form>
        <p> Did you mean to <Link to="/auth/login">Log In</Link> instead?</p>
      </div>
    );
  }
}

export default withRouter(Register);
