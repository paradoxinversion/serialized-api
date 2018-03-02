import React from "react";
import PropTypes from "prop-types";
import {
  Link
} from "react-router-dom";
import axios from "axios";
import "./SerialEntryContainer.css";

class SerialEntryContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isSubscribed: false
    };
  }

  async checkForSubscription(){
    const result = await axios.get(`/serial-subscriptions/${this.props.serial._id}/check`);
    if (result.data && !result.data.error){
      this.setState({
        isSubscribed: true
      });
    } else{
      this.setState({
        isSubscribed: false
      });
    }
  }

  async toggleSerialSubscription(){
    try{
      const requestConfiguration = {
        withCredentials: true
      };

      await axios.get(`/serial-subscriptions/${this.props.serial._id}`, requestConfiguration);
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
        <h2>{this.props.serial.title}</h2>
        <p>{this.props.serial.synopsis}</p>
        <div className="level is-mobile">
          <div className="level-left">
            <Link className="button is-primary" to={`serials/${this.props.serial._id}`}>Read It</Link>
            {subscriptionOptions}
            {authorOptions}
          </div>
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
