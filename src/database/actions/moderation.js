const Report = require("../mongo/Report");

/**
 *
 * @param {*} user
 * @param {*} serial
 * @param {*} serialPart
 */
const createReport = async (
  user,
  serial,
  serialPart,
  reportType,
  extraDetails,
  reportingUser
) => {
  const args = [...arguments];
  let hasReportTarget = false;
  args.slice(0, 2).forEach((val) => {
    if (val !== null && val !== undefined) {
      hasReportTarget = true;
    }
  });
  if (hasReportTarget) {
    const newReport = new Report({
      user,
      serial,
      serialPart,
      reportType,
      extraDetails,
      reportingUser,
    });

    await newReport.save();
    return newReport;
  } else {
    const noReportTargetError = new Error(
      "No Report Target (user, serial, or serial part) in args"
    );
    throw noReportTargetError;
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
