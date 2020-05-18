const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");
const Genre = require("../src/database/mongo/Genre");
const Serial = require("../src/database/mongo/Serial");
const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const databaseInit = require("../src/database/databaseInit");
const chaiAsPromised = require("chai-as-promised");
const _ = require("lodash");
const app = require("../src/app");

chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe("Moderation DB Actions", function () {
  before(async function () {
    this.dbConnection = await dbHelpers.prepareTestDB();
  });

  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
  afterEach(async function () {
    // Drop the database after each test
    await this.dbConnection.connection.db.dropDatabase();
  });
  describe("createReport", function () {
    beforeEach(async function () {
      // reporting a user...
      this.testGenre = await dataHelper.seedGenre("Test", "A test genre");
      this.admin = await dataHelper.seedUser(2);
      this.userOne = await dataHelper.seedUser();
      this.userTwo = await dataHelper.seedUser();
      this.serial = await dataHelper.seedSerial(
        this.userOne.id,
        this.testGenre
      );
      this.serialPartOne = await dataHelper.seedSerialPart(this.serial, 1);
      this.serialPartTwo = await dataHelper.seedSerialPart(this.serial, 2);
      this.userToken = await dataHelper.signFakeToken(
        app.locals.tokenManager,
        this.userOne
      );
      this.adminToken = await dataHelper.signFakeToken(
        app.locals.tokenManager,
        this.admin
      );
    });
    afterEach(async function () {
      // Drop the database after each test
      await this.dbConnection.connection.db.dropDatabase();
    });

    it("creates a report against a user", async function () {
      return chai
        .request(app)
        .post(`/api/v1/report`)
        .set({ Authorization: "Bearer " + this.userToken })
        .send({
          report_type: "user",
          reported_item: this.userTwo.id,
          extra_details: "They're a jerk.",
          reporting_user: this.userOne.id,
        })
        .then(function (res) {
          debugger;
          expect(res).to.have.status(201);
          expect(res.type).to.eql("application/vnd.api+json");
        });
    });
  });

  describe("readReports", function () {
    beforeEach(async function () {
      // reporting a user...
      this.testGenre = await dataHelper.seedGenre("Test", "A test genre");
      this.admin = await dataHelper.seedUser(2);
      this.userOne = await dataHelper.seedUser();
      this.userTwo = await dataHelper.seedUser();
      this.serial = await dataHelper.seedSerial(
        this.userOne.id,
        this.testGenre
      );
      this.serialPartOne = await dataHelper.seedSerialPart(this.serial, 1);
      this.serialPartTwo = await dataHelper.seedSerialPart(this.serial, 2);
      this.userToken = await dataHelper.signFakeToken(
        app.locals.tokenManager,
        this.userOne
      );
      this.adminToken = await dataHelper.signFakeToken(
        app.locals.tokenManager,
        this.admin
      );
    });
    afterEach(async function () {
      // Drop the database after each test
      await this.dbConnection.connection.db.dropDatabase();
    });
    // before(function () {});
    it("Reads reports", async function () {
      // reporting a user...
      // const userOne = await dataHelper.seedUser();
      // const userTwo = await dataHelper.seedUser();
      await dataHelper.makeFakeReport(
        "user",
        this.userTwo.id,
        "Actually, just a test",
        this.userOne.id
      );

      return chai
        .request(app)
        .get(`/api/v1/report`)
        .set({ Authorization: "Bearer " + this.adminToken })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res.type).to.eql("application/vnd.api+json");
        });
    });
  });
});
