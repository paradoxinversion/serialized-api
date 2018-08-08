import Report from "../mongo/Report";

/**
 *
 * @param {*} user
 * @param {*} serial
 * @param {*} serialPart
 */
export const createReport = async (
  user,
  serial,
  serialPart,
  reportType,
  extraDetails,
  reportingUser
) => {
  const args = [...arguments];
  let hasReportTarget = false;
  args.slice(0, 2).forEach(val => {
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
      reportingUser
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

export const getReports = async () => {
  const reports = await Report.find();
  return reports;
};
