import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
import ProfileEdit from "../ProfileEdit/ProfileEdit";
import HTMLMarkupContainer from "../../../Components/Containers/HTMLMarkupContainer/HTMLMarkupContainer";
import SerialList from "../../../Components/Common/SerialList/SerialList";
import getProfileData from "../../../utilityFunctions/profile/getProfileData";
import getUserSerialData from "../../../utilityFunctions/serials/getUserSerialData";
import handleProfileEdit from "../../../utilityFunctions/profile/handleProfileEdit";
import "./Profile.css";

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
    this.getProfileData = this.getProfileData.bind(this);
  }

  async getProfileData (){
    try{
      const response = await getProfileData(this.props.match.params.username);
      this.setState({
        queriedUser: response.userData,
        isProfileOwner: response.isQueriedUser
      });
      await this.getUserSerialData();
    } catch (e){
      console.error("Something went wrong: \n ", e);
    }
  }

  async getUserSerialData(){
    try{
      const serialData = await getUserSerialData(this.state.queriedUser._id);
      this.setState({
        userSerials: serialData
      });
    } catch (e){
      console.error("Something went wrong: \n ", e);
    }
  }

  async componentWillMount(){
    await this.getProfileData();
  }

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
    await handleProfileEdit(this.state.biography);
    this.setState({
      editMode: false
    });
    this.getProfileData();
  }

  render() {
    if (this.state.editMode){
      return (
        <ProfileEdit textChanged={this.handleQuillInput} handleSubmit={this.handleProfileSubmit} handleCancel={this.handleCancelEdit}/>
      );
    }else {
      return (
        <div className="profile">
          <h1 className="title"> {this.state.queriedUser.username} </h1>
          <HTMLMarkupContainer content={this.state.queriedUser.biography} />
          {
            (this.props.clientUser && this.state.queriedUser._id === this.props.clientUser._id) ?
              (<React.Fragment>
                <button className="button right-aligned" onClick={this.handleEditButtonClick.bind(this)}> Edit Profile </button>
              </React.Fragment>) :
              null
          }
          <hr className="horizontal-rule" />

          <SerialList
            clientUser={this.props.clientUser}
            emptyListMessage={`${this.props.match.params.username} hasn't written any serials yet.`}
            serials={this.state.userSerials}
            getProfileData={this.getProfileData}
            toggleSerialSubscription={this.props.toggleSerialSubscription}
          />
        </div>
      );
    }
  }
}

Profile.propTypes = {
  clientUser: PropTypes.object,
  match: PropTypes.object.isRequired
};

export default withRouter(Profile);
