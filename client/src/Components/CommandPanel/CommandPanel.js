import React, { Component } from "react";
// import DashboardButton from "../../../Components/DashboardButton/DashboardButton";
// import "./Dashboard.css";
class CommandPanel extends Component {
  render() {
    return (
      <div className="dashboard">
        {" "}
        <div className="dashboard__control-group">
          {this.props.commandOptions.map(button => (
            <button
              key={button.text}
              className="dashboard__button"
              onClick={() => {
                this.props.setMode(button.section);
              }}>
              {button.text}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default CommandPanel;
