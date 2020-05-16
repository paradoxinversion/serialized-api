const faker = require("faker");
const { expect } = require("chai");
const {
  createReport,
  getReports,
} = require("../src/database/actions/moderation");
const User = require("../src/database/mongo/User");
const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const databaseInit = require("../src/database/databaseInit");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("Moderation DB Actions", function () {
  describe("createReport", function () {
    before(function () {});
    it("creates a report...", async function () {
      // reporting a user...
      const userOne = await dataHelper.seedUser();
      const userTwo = await dataHelper.seedUser();
      const report = await createReport({
        report_type: "user",
        reported_item: userOne.id,
        extra_details: "Actually, just a test",
        reporting_user: userTwo.id,
      });
      debugger;
      expect(report.reported_item._id.toString()).to.eql(userOne.id); // it should resolve to an id...?
      expect(report.reporting_user._id.toString()).to.eql(userTwo.id);
      expect(report.extra_details).to.equal("Actually, just a test");
    });
  });
});
