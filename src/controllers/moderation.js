const moderationActions = require("../database/actions/moderation");

const createReport = async (req, res) => {
  try {
    await moderationActions.createReport(
      req.body.reportDetails.user,
      req.body.reportDetails.serial,
      req.body.reportDetails.serialPart,
      req.body.reportDetails.reportType,
      req.body.reportDetails.extraDetails,
      req.body.reportDetails.reportingUser
    );

    res.json({
      message: "Report has been successfully filed",
      reportSuccess: true,
    });
  } catch (e) {
    res.json({
      error: e,
      message: "Report filing has failed",
      reportSuccess: false,
    });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await moderationActions.getReports();
    res.json({
      reports,
    });
  } catch (e) {
    res.json({
      error: e,
    });
  }
};

module.exports = {
  createReport,
  getReports,
};
