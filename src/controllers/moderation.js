const moderationActions = require("../database/actions/moderation");

const createReport = async (req, res) => {
  try {
    const {
      report_type,
      reported_item,
      extra_details,
      reporting_user,
      id,
    } = await moderationActions.createReport({
      reported_item: req.body.reported_item,
      report_type: req.body.report_type,
      extra_details: req.body.extra_details,
      reporting_user: req.body.reporting_user,
    });
    const response = {
      data: {
        id,
        type: "report",
        attributes: {
          extra_details,
          report_type,
        },
        relationships: {
          reporting_user: {
            data: {
              id: reporting_user._id.toString(),
              type: "user",
            },
          },
          reported_item: {
            data: {
              id: reported_item._id.toString(),
              type: report_type,
            },
          },
        },
      },
    };

    res.status(201).type("application/vnd.api+json").json(response);
  } catch (e) {
    res.status(400).json({
      errors: [e],
    });
  }
};

const getReports = async (req, res) => {
  debugger;
  try {
    const reports = await moderationActions.getReports();
    res.status(200).type("application/vnd.api+json").json({
      reports,
    });
  } catch (e) {
    res
      .status(400)
      .type("application/vnd.api+json")
      .json({
        errors: [e],
      });
  }
};

module.exports = {
  createReport,
  getReports,
};
