import React from "react";
import sendReport from "../../utilityFunctions/moderation/sendReport";
class FileReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportType: -1,
      extraDetails: "",
      reportSent: false
    };
  }

  async handleFormInput(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    await this.setState({
      [name]: value
    });
  }

  async handleReportSubmission(event) {
    event.preventDefault();
    const reportDetails = {
      user: this.props.location.state.user,
      serial: this.props.location.state.serial,
      serialPart: this.props.location.state.serialPart,
      reportType: this.state.reportType,
      extraDetails: this.state.extraDetails,
      reportingUser: this.props.clientUser._id
    };
    const reportResult = await sendReport(reportDetails);
    this.setState({ reportSent: reportResult.data.reportSuccess });
  }

  render() {
    return (
      <div>
        <h1>File a Report</h1>
        {this.state.reportSent === false ? (
          <form>
            <p>What is the reason you are reporting today?</p>
            <div>
              <select
                name="reportType"
                id="report-type-select"
                onChange={this.handleFormInput.bind(this)}>
                <option value="">Select a Reason</option>
                <option value="0">Harassment/Stalking</option>
                <option value="1">Hateful Content</option>
                <option value="2">Copyright Infringment</option>
              </select>
            </div>
            <p>
              Are there any other details you would like to add to your report?
            </p>
            <textarea
              name="extraDetails"
              placeholder="Be as descriptive as possible to help make sure we handle your report properly"
              onChange={this.handleFormInput.bind(this)}
            />
            <button onClick={this.handleReportSubmission.bind(this)}>
              Submit Report
            </button>
          </form>
        ) : (
          <div>Your report has been sent</div>
        )}
      </div>
    );
  }
}

export default FileReport;
