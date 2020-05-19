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

describe("HTTP /serials/:serialId", function () {
  before(async function () {
    this.dbConnection = await dbHelpers.prepareTestDB();
  });
  beforeEach(async function () {
    // Create a random user and serial
    this.testGenre = await dataHelper.seedGenre(
      "Test Genre",
      "A genre for testing."
    );
    this.testUser = await dataHelper.seedUser();
    this.testSerial = await dataHelper.seedSerial(
      this.testUser.id,
      this.testGenre.id
    );
  });
  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
  afterEach(async function () {
    // Drop the database after each test
    await this.dbConnection.connection.db.dropDatabase();
  });

  describe("GET", function () {
    it("Gets parts related to a serial", async function () {
      await dataHelper.seedSerialPart(this.testSerial, 1);
      return chai
        .request(app)
        .get(`/api/v1/serials/${this.testSerial.id}`)
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res.type).to.eql("application/vnd.api+json");
          expect(res.body).to.have.all.keys("data", "relationships");
          expect(res.body.data[0].attributes).to.have.all.keys(
            "title",
            "slug",
            "creation_date",
            "content",
            "last_modified",
            "part_number"
          );
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  describe("POST", function () {
    it("Creates a serial part", async function () {
      const token = dataHelper.signFakeToken(
        app.locals.tokenManager,
        this.testUser
      );
      return chai
        .request(app)
        .post(`/api/v1/serials/${this.testSerial.id}`)
        .set({ Authorization: "Bearer " + token })
        .send({ title: "Test Serial", content: "Some fake content" })
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res.type).to.eql("application/vnd.api+json");
          expect(res.body).to.have.all.keys("data", "relationships");
          expect(res.body.data.attributes).to.have.all.keys(
            "title",
            "slug",
            "creation_date",
            "content",
            "last_modified",
            "part_number"
          );
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  describe("PATCH", function () {
    it("Updates serial part data", async function () {
      const serial = await dataHelper.seedSerial(
        this.testUser.id,
        this.testGenre
      );
      const serialPart = await dataHelper.seedSerialPart(serial, 1);
      const token = dataHelper.signFakeToken(
        app.locals.tokenManager,
        this.testUser
      );

      return chai
        .request(app)
        .patch(`/api/v1/serials/${this.testSerial.id}`)
        .set({ Authorization: "Bearer " + token })
        .send({
          title: "A brand new title",
          content: "New test content!",
          partId: serialPart.id,
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res.type).to.eql("application/vnd.api+json");
          expect(res.body.data.type).to.eql("serialPart");
          expect(res.body.data.attributes).to.have.all.keys(
            "title",
            "slug",
            "creation_date",
            "content",
            "last_modified",
            "part_number"
          );

          expect(res.body.data.attributes.title).to.eql("A brand new title");
        });
    });
  });
});
