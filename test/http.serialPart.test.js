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

describe("HTTP /serials/:serialId/:partId", function () {
  // test db is created when the server runs....
  before(async function () {
    this.dbConnection = await dbHelpers.prepareTestDB();
  });

  afterEach(async function () {
    // Drop the database after each test
    await this.dbConnection.connection.db.dropDatabase();
  });

  describe("GET", async function () {
    before(async function () {
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

    it("Gets a single serial part's data", async function () {
      const serial = await dataHelper.seedSerial(this.testUser, this.testGenre);
      const serialPart = await dataHelper.seedSerialPart(serial, 1);

      return chai
        .request(app)
        .get(`/api/v1/serials/${this.testSerial.id}/${serialPart.id}`)
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res.type).to.eql("application/vnd.api+json");
          expect(res.body.title).to.eql(serialPart.title);
        });
    });
  });

  describe("DELETE", async function () {
    before(async function () {
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
    it("deletes a serialPart", async function () {
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
        .delete(`/api/v1/serials/${this.testSerial.id}/${serialPart.id}`)
        .set({ Authorization: "Bearer " + token })
        .then(function (res) {
          debugger;
          expect(res).to.have.status(200);
          expect(res.type).to.eql("application/vnd.api+json");
          expect(res.body.data.type).to.eql("serialPart");
        });
    });
  });

  describe("PATCH", async function () {
    before(async function () {
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
    it("Changes a serial's part number (by trading it up or down)", async function () {
      const serial = await dataHelper.seedSerial(
        this.testUser.id,
        this.testGenre
      );
      const serialPartOne = await dataHelper.seedSerialPart(serial, 1);
      const serialPartTwo = await dataHelper.seedSerialPart(serial, 2);
      const token = dataHelper.signFakeToken(
        app.locals.tokenManager,
        this.testUser
      );

      return chai
        .request(app)
        .patch(`/api/v1/serials/${this.testSerial.id}/${serialPartOne.id}`)
        .send({ serialPartId: serialPartOne.id, moveUp: true })
        .set({ Authorization: "Bearer " + token })
        .then(function (res) {
          debugger;
          expect(res).to.have.status(200);
          expect(res.type).to.eql("application/vnd.api+json");
          expect(res.body.data.type).to.eql("serialPart");
          expect(res.body.data.attributes.part_number).to.eql(2);
          expect(res.body.data.attributes).to.have.all.keys(
            "title",
            "slug",
            "creation_date",
            "content",
            "last_modified",
            "part_number"
          );
        });
    });
  });

  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
});
