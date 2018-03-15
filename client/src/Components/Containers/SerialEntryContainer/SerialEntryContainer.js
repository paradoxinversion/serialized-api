import React from "react";
import PropTypes from "prop-types";
import {
  Link
} from "react-router-dom";
import toggleSerialSubscription from "../../../utilityFunctions/serials/toggleSerialSubscription";
import checkForSubscription from "../../../utilityFunctions/serials/checkForSubscription";
import "./SerialEntryContainer.css";

class SerialEntryContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isSubscribed: false
    };
  }

  async checkForSubscription(){
    const result = await checkForSubscription(this.props.serial._id);
    console.log(result);
    this.setState({
      isSubscribed: result.isSubscribed
    });
  }

  async toggleSerialSubscription(){
    try{
      await toggleSerialSubscription(this.props.serial._id);
    } catch (e){
      console.log(e);
      throw e;
    }
  }

  async componentDidMount(){
    await this.checkForSubscription();
  }

  render(){
    let authorOptions;
    let subscriptionOptions;
    let subscribeButtonText = "Subscribe";
    if (this.state.isSubscribed){
      subscribeButtonText = "Unsubscribe";
    }
    if (this.props.clientUser){
      subscriptionOptions = (
        <button onClick={async ()=>{
          await this.toggleSerialSubscription(this.props.serial._id);
          await this.checkForSubscription(this.props.serial._id);
        }} className="button is-disabled level-item">{subscribeButtonText}</button>
      );
    }

    if (this.props.serial && this.props.clientUser && this.props.clientUser._id === this.props.serial.author_id){
      authorOptions = (
        <div className="level is-mobile">
          <Link className="button level-item" to={`/serials/${this.props.serial._id}/new`}> Create a New Part </Link>
          <button onClick={()=>{
            this.props.onSerialDeleted(this.props.serial._id);
          }} className="button is-danger level-item">Delete</button>
        </div>
      );
    }
    return (
      <div className="entry-container">
        <h2 className="serial-entry-title">{this.props.serial.title}</h2>
        <p className="serial-entry-synopsis">{this.props.serial.synopsis}</p>
        <div className="serial-entry-options">
          <Link className="button" to={`/serials/${this.props.serial._id}`}>Read It</Link>
          {subscriptionOptions}
          {authorOptions}
        </div>
      </div>
    );
  }
}

SerialEntryContainer.propTypes = {
  serial: PropTypes.object.isRequired,
  clientUser: PropTypes.object,
  onSerialDeleted: PropTypes.func
};

export default SerialEntryContainer;
