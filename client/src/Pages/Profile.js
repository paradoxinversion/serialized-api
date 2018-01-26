import React from 'react';
import queryString from 'query-string';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios';
const SerialList = withRouter((props) => {

  if (props.serials.length > 0){
    const serials = props.serials.map((serial) => {
      return <li key={serial._id}><Link to={`/serials/${serial._id}`}>{serial.title}</Link></li>;
    });
    return (
      <div>
        <p> User Serials </p>
        <ul>{serials}</ul>
      </div>
    );
  } else{
    return <p> {props.match.params.username} hasn&apos;t written any serials yet. </p>;
  }
});
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queriedUser: {},
      isProfileOwner: false,
      editMode: false,
      userSerials: []
    };
  }

  // Get profile data of the queried user
  async getProfileData (){
    try{
      const requestConfiguration = {
        withCredentials: true
      };
      const uri = `/users/${this.props.match.params.username}`;
      const response = await axios.get(uri, requestConfiguration);
      this.setState({
        queriedUser: response.data.userData,
        isProfileOwner: response.data.isQueriedUser
      });
      this.getUserSerialData();
    } catch (e){
      console.log("Something went wrong: \n ", e);
    }
  }

  async getUserSerialData(){
    try{
      const requestConfiguration = {
        withCredentials: true
      };
      const uri = `/serials?userId=${this.state.queriedUser._id}`;
      const serialData = await axios.get(uri, requestConfiguration);
      this.setState({
        userSerials: serialData.data
      });
    } catch (e){
      console.log("Something went wrong: \n ", e);
    }

  }
  componentDidMount(){


  }
  componentWillMount(){
    this.getProfileData();
    this.props.onLoad();
  }

  // Client user will be null no matter what (?) when this page mounts
  // Use this to update when the component recieves props
  componentWillReceiveProps(nextProps){
    // if (nextProps.clientUser !== this.props.clientUser){
    //   this.setState({
    //     clientUser: nextProps.clientUser
    //   });
    // }
  }
  handleFormInput(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value

    });
  }
  handleEditButtonClick(){
    this.setState({
      editMode: true
    });
  }

  async handleProfileSubmit(){
    const uri = `/users`;
    const data = {
      biography: this.state.biography
    };
    const configuration = {
      withCredentials: true
    };
    await axios.put(uri, data, configuration);
    this.setState({
      editMode: false
    });
    this.getProfileData();
  }


  render() {
    let editProfileLink;
    let createSerialLink;
    if (this.state.queriedUser._id === this.props.clientUser.id){
      editProfileLink = <button className="button" onClick={this.handleEditButtonClick.bind(this)}> Edit Profile </button>;
      // const newSerialLink = `/create-serial?user=${this.state.query.user}`;
      const newSerialLink = `/serials/create`;
      createSerialLink = <Link to={newSerialLink}> Create a new Serial </Link>;
    }

    if (this.state.editMode){
      return (
        <div>
          <h1> Profile Edit</h1>
          <h1> {this.props.clientUser.username} </h1>
          <form>
            <label> Bio <textarea name="biography" onChange={this.handleFormInput.bind(this)}></textarea></label>
          </form>
          <button className="button" >onClick={this.handleProfileSubmit.bind(this)}> Submit </button>
        </div>
      );
    }else {
      return (
        <div className="container is-fluid">
          <h1 className="title is-4"> {this.state.queriedUser.username} </h1>

          <p> {this.state.queriedUser.biography} </p>
          {editProfileLink}

          {createSerialLink}
          <SerialList queriedUser={this.state.queriedUser} serials={this.state.userSerials}/>
        </div>
      );
    }
  }
}

export default withRouter(Profile);
