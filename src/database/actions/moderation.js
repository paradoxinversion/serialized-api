const Report = require("../mongo/Report");

/**
 *
 * @param {*} user
 * @param {*} serial
 * @param {*} serialPart
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
