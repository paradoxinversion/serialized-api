import React, { Component } from "react";
import { CheckBox } from "../../Components/Common/Forms/FormComponents";
import updateNSFWSetting from "../../utilityFunctions/users/updateNSFWSetting";

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ["nsfw-check"]: this.props.clientUser.viewNSFW
    };
  }
  async updateClientNSFWSettings(event) {
    const target = event.target;
    await this.setState({
      ["nsfw-check"]: target.checked
    });
    await updateNSFWSetting(target.checked);
  }
  render() {
    return (
      <div className="container">
        <p>User Settings</p>
        <div>
          <label htmlFor="nsfw-check">View NSFW Content</label>
          <input
            type="checkbox"
            name="nsfw-check"
            checked={this.state["nsfw-check"]}
            onChange={this.updateClientNSFWSettings.bind(this)}
          />
          {/* <CheckBox
            title="View NSFW Content"
            name="nsfw-check"
            checked={this.state["nsfw-check"]}
            controlFunc={this.updateClientNSFWSettings.bind(this)}
          /> */}
        </div>
      </div>
    );
  }
}

export default UserSettings;
