import React from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import ProfileEdit from "../ProfileEdit/ProfileEdit";
import HTMLMarkupContainer from "../../../Components/Containers/HTMLMarkupContainer/HTMLMarkupContainer";
import SerialList from "../../../Components/Common/SerialList/SerialList";
import "../../../css/bulma.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queriedUser: {
        biography: ""
      },
      isProfileOwner: false,
      editMode: false,
      userSerials: []
    };
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleQuillInput = this.handleQuillInput.bind(this);
    this.handleProfileSubmit = this.handleProfileSubmit.bind(this);
  }

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

  componentWillMount(){
    this.getProfileData();
  }

  // handleFormInput(event){
  //   const target = event.target;
  //   const value = target.type === "checkbox" ? target.checked : target.value;
  //   const name = target.name;
  //   this.setState({
  //     [name]: value
  //
  //   });
  // }
  handleQuillInput(quillContent){
    this.setState({
      biography: quillContent
    });
  }
  handleEditButtonClick(){
    this.setState({
      editMode: true
    });
  }

  handleCancelEdit(){
    this.setState({
      editMode: false
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
    let userActions;
    if (this.props.clientUser && this.state.queriedUser._id === this.props.clientUser.id){
      const newSerialLink = `/serials/create`;
      userActions = (
        <div className="level">
          <button className="button level-item" onClick={this.handleEditButtonClick.bind(this)}> Edit Profile </button>
          <Link className="button level-item" to={newSerialLink}> Create a new Serial </Link>
        </div>
      );
    }
    if (this.state.editMode){
      return (
        <ProfileEdit textChanged={this.handleQuillInput} handleSubmit={this.handleProfileSubmit} handleCancel={this.handleCancelEdit}/>
      );
    }else {
      return (
        <div className="container is-fluid">
          <h1 className="title is-4"> {this.state.queriedUser.username} </h1>
          <HTMLMarkupContainer content={this.state.queriedUser.biography} />
          {userActions}
          <SerialList emptyListMessage={`${this.props.match.params.username} hasn't written any serials yet.`} serials={this.state.userSerials}/>
        </div>
      );
    }
  }
}

export default withRouter(Profile);
