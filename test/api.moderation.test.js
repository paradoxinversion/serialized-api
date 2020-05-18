const faker = require("faker");
const { expect } = require("chai");
const {
  createReport,
  getReports,
} = require("../src/database/actions/moderation");
const User = require("../src/database/mongo/User");
const Serial = require("../src/database/mongo/Serial");

const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const databaseInit = require("../src/database/databaseInit");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("Moderation DB Actions", function () {
  before(async function () {
    this.dbConnection = await dbHelpers.prepareTestDB();
  });

  afterEach(async function () {
    // Drop the database after each test
    await this.dbConnection.connection.db.dropDatabase();
  });
  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
  describe("createReport", function () {
    beforeEach(async function () {
      // reporting a user...
      this.testGenre = await dataHelper.seedGenre("Test", "A test genre");
      this.userOne = await dataHelper.seedUser();
      this.userTwo = await dataHelper.seedUser();
      this.serial = await dataHelper.seedSerial(
        this.userOne.id,
        this.testGenre
      );
      this.serialPartOne = await dataHelper.seedSerialPart(this.serial, 1);
      this.serialPartTwo = await dataHelper.seedSerialPart(this.serial, 2);
    });
    afterEach(async function () {
      // Drop the database after each test
      await this.dbConnection.connection.db.dropDatabase();
    });

    it("creates a report against a user", async function () {
      const report = await createReport({
        report_type: "user",
        reported_item: this.userOne.id,
        extra_details: "Actually, just a test",
        reporting_user: this.userTwo.id,
      });

      const subject = await User.findById(report.reported_item);
      expect(report.reported_item._id.toString()).to.eql(this.userOne.id); // it should resolve to an id...?
      expect(report.reporting_user._id.toString()).to.eql(this.userTwo.id);
      expect(report.extra_details).to.equal("Actually, just a test");
      expect(subject.id).to.eql(this.userOne.id);
    });

    it("creates a report against a serial", async function () {
      const report = await createReport({
        report_type: "serial",
        reported_item: this.serial.id,
        extra_details: "It's a weird serial",
        reporting_user: this.userTwo.id,
      });

      const subject = await Serial.findById(report.reported_item);
      debugger;
      expect(report.reported_item._id.toString()).to.eql(this.serial.id); // it should resolve to an id...?
      expect(report.reporting_user._id.toString()).to.eql(this.userTwo.id);
      expect(report.extra_details).to.equal("It's a weird serial");
      expect(subject.id).to.eql(this.serial.id);
    });
  });

  describe("readReports", function () {
    it("Reads reports", async function () {
      // reporting a user...
      const userOne = await dataHelper.seedUser();
      const userTwo = await dataHelper.seedUser();
      await dataHelper.makeFakeReport(
        "user",
        userTwo.id,
        "Actually, just a test",
        userOne.id
      );

      const reportResults = await getReports();
      debugger;
      expect(reportResults[0].reported_item._id.toString()).to.eql(userTwo.id); // it should resolve to an id...?
      expect(reportResults[0].reporting_user._id.toString()).to.eql(userOne.id);
      expect(reportResults[0].extra_details).to.equal("Actually, just a test");
    });
  });
});
