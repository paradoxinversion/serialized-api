const chai = require("chai");
const chaiHttp = require("chai-http");

const faker = require("faker");
const { expect } = require("chai");
const User = require("../src/database/mongo/User");
const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const databaseInit = require("../src/database/databaseInit");

const chaiAsPromised = require("chai-as-promised");

chai.use(chaiHttp);
chai.use(chaiAsPromised);

const app = require("../src/app");

describe("Likes API Calls", function () {
  describe("POST /api/v1/like", function () {
    beforeEach(async function () {
      this.testDb = await dbHelpers.prepareTestDB();
    });
    afterEach(async function () {
      this.testDb.connection.dropDatabase();
    });
    it("Creates a new like in the db", async function () {
      const userOne = await dataHelper.seedUser();
      const userTwo = await dataHelper.seedUser();
      const genre = await dataHelper.seedGenre("Test", "A test genre");
      const serial = await dataHelper.seedSerial(userOne.id, genre);
      const token = await dataHelper.signFakeToken(
        app.locals.tokenManager,
        userTwo
      );
      return chai
        .request(app)
        .post(`/api/v1/like`)
        .set({ Authorization: "Bearer " + token })
        .send({ likeType: "serial", subject: serial.id })
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res.type).to.eql("application/vnd.api+json");
          expect(res.body).to.have.key("data");
          expect(res.body.data).to.have.key(
            "relationships",
            "id",
            "attributes",
            "type"
          );
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  describe("GET /api/v1/like", function () {
    beforeEach(async function () {
      this.testDb = await dbHelpers.prepareTestDB();
    });
    afterEach(async function () {
      this.testDb.connection.dropDatabase();
    });
    it("Gets all likes related to a serial", async function () {
      const userOne = await dataHelper.seedUser();
      const userTwo = await dataHelper.seedUser();
      const userThree = await dataHelper.seedUser();
      const userFour = await dataHelper.seedUser();
      const genre = await dataHelper.seedGenre("Test", "A test genre");
      const serial = await dataHelper.seedSerial(userOne.id, genre);
      const subscription = await dataHelper.seedSubscription(
        userTwo.id,
        "serial",
        serial
      );

      const subOne = await dataHelper.seedLike(userTwo.id, "serial", serial.id);
      const subTwo = await dataHelper.seedLike(
        userThree.id,
        "serial",
        serial.id
      );
      const subThree = await dataHelper.seedLike(
        userFour.id,
        "serial",
        serial.id
      );

      return chai
        .request(app)
        .get(`/api/v1/like`)
        .query({ itemId: serial.id, like_type: "serial" })
        .then(function (res) {
          debugger;
          expect(res).to.have.status(201);
          expect(res.type).to.eql("application/vnd.api+json");
          expect(res.body).to.have.key("data");
          expect(res.body.data).to.be.an.instanceOf(Array);
          expect(res.body.data[0]).to.have.key(
            "relationships",
            "id",
            "attributes",
            "type"
          );
        })
        .catch(function (err) {
          throw err;
        });
    });
  });
});
