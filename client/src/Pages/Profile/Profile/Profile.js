import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import ProfileEdit from "../ProfileEdit/ProfileEdit";
import HTMLMarkupContainer from "../../../Components/Containers/HTMLMarkupContainer/HTMLMarkupContainer";
import SerialList from "../../../Components/Common/SerialList/SerialList";
import getProfileData from "../../../utilityFunctions/profile/getProfileData";
import getUserSerialData from "../../../utilityFunctions/serials/getUserSerialData";
import handleProfileEdit from "../../../utilityFunctions/profile/handleProfileEdit";
import ReportButton from "../../../Components/ReportButton/ReportButton";
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

  async getProfileData() {
    try {
      const response = await getProfileData(this.props.match.params.username);
      this.setState({
        queriedUser: response.userData,
        isProfileOwner: response.isQueriedUser
      });
      await this.getUserSerialData();
    } catch (e) {
      console.error("Something went wrong: \n ", e);
    }
  }

  async getUserSerialData() {
    try {
      const serialData = await getUserSerialData(this.state.queriedUser._id);
      this.setState({
        userSerials: serialData
      });
    } catch (e) {
      console.error("Something went wrong: \n ", e);
    }
  }

  async componentDidMount() {
    await this.getProfileData();
  }

  handleQuillInput(quillContent) {
    this.setState({
      biography: quillContent
    });
  }

  handleEditButtonClick() {
    this.setState({
      editMode: true
    });
  }

  handleCancelEdit() {
    this.setState({
      editMode: false
    });
  }

  async handleProfileSubmit() {
    await handleProfileEdit(this.state.biography);
    this.setState({
      editMode: false
    });
    this.getProfileData();
  }

  render() {
    if (this.state.editMode) {
      return (
        <ProfileEdit
          textChanged={this.handleQuillInput}
          handleSubmit={this.handleProfileSubmit}
          handleCancel={this.handleCancelEdit}
        />
      );
    } else {
      return (
        <main className="profile">
          <header className="container ">
            <h1>User Profile</h1>
            <p className="title"> {this.state.queriedUser.username} </p>
            <HTMLMarkupContainer content={this.state.queriedUser.biography} />
            {this.props.clientUser &&
            this.state.queriedUser._id === this.props.clientUser._id ? (
              <Fragment>
                <button
                  className="button right-aligned"
                  onClick={this.handleEditButtonClick.bind(this)}>
                  Edit Profile
                </button>
              </Fragment>
            ) : null}
            <hr className="horizontal-rule" />
          </header>

          <section className="container">
            <SerialList
              clientUser={this.props.clientUser}
              emptyListMessage={`${
                this.props.match.params.username
              } hasn't written any serials yet.`}
              serials={this.state.userSerials}
              getProfileData={this.getProfileData}
              toggleSerialSubscription={this.props.toggleSerialSubscription}
            />
          </section>
          <ReportButton
            user={this.state.queriedUser._id}
            serial={null}
            serialPart={null}
          />
        </main>
      );
    }
  }
}

Profile.propTypes = {
  clientUser: PropTypes.object,
  match: PropTypes.object.isRequired,
  toggleSerialSubscription: PropTypes.func.isRequired
};

export default withRouter(Profile);
