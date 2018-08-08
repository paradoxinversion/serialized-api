import React from "react";
import getReports from "../../../utilityFunctions/moderation/getReports";

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: []
    };
    console.log(Array.isArray(this.state.reports));
  }
  async componentDidMount() {
    const reports = await getReports();
    this.setState({
      reports: reports.data.reports
    });
  }
  render() {
    return (
      <div>
        <p>Outstanding Reports</p>
        {Array.isArray(this.state.reports)
          ? this.state.reports.filter(r => r.reportType === 0).map(report => {
              return (
                <div key={report._id}>
                  <p>{report.extraDetails}</p>
                </div>
              );
            })
          : null}
      </div>
    );
  }
}

export default Reports;
