const Report = require("../mongo/Report");

/**
 * Create a new report by a user
 * @param {*} param0
 * @param {*} param0.report_type - the type of report
 * @param {*} param0.reported_item - the id of the item being reported
 * @param {*} param0.reporteing_user - the id of the user filing the report
 * @param {*} param0.extra_details - extra details about the report
 */
const createReport = async ({
  report_type,
  reported_item,
  extra_details,
  reporting_user,
}) => {
  try {
    if (!report_type) throw new Error("No report type included");
    if (!reported_item) throw new Error("No report subject included");
    if (!reporting_user) throw new Error("No report user included");
    const report = new Report({
      report_type,
      reported_item,
      extra_details,
      reporting_user,
    });

    await report.save();
    return report;
  } catch (e) {
    throw e;
  }
};

/**
 * Retrives all user generated content reports in the db
 */
const getReports = async () => {
  const reports = await Report.find()
    .populate("user")
    .populate("reportingUser");
  return reports;
};

module.exports = {
  createReport,
  getReports,
};
