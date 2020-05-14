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

chai.use(chaiHttp);
chai.use(chaiAsPromised);

const app = require("../src/app");

describe("Serials API calls", function () {
  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });

  before(async function () {
    await dbHelpers.prepareTestDB();

    const [admin, testUser, testUserTwo, testGenre] = await Promise.all([
      dbHelpers.prepareTestDB(),
      databaseInit(),
      dataHelper.seedUser(),
      dataHelper.seedUser(),
      dataHelper.seedGenre("Test Genre", "A genre for testing."),
    ]);
    this.testAdmin = admin;
    this.testUser = testUser;
    this.testGenre = testGenre;
    this.token = dataHelper.signFakeToken(
      app.locals.tokenManager,
      this.testUser
    );
  });
  describe("/serials", function () {
    describe("GET", function () {
      before(async function () {
        this.testGenre = await dataHelper.seedGenre("Test Genre", "Testable");
        await dataHelper.seedSerials(this.testUser.id, this.testGenre, 10);
      });

      it("reads all serial data", async function () {
        const serialData = dataHelper.fakeSerialData();
        return chai
          .request(app)
          .get("/api/v1/serials")
          .set({ Authorization: "Bearer " + this.token })
          .send({ ...serialData, genre: this.testGenre })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.key("data");
            expect(res.body.data[0].attributes).to.have.all.keys(
              "title",
              "synopsis",
              "slug",
              "nsfw",
              "creation_date"
            );
          })
          .catch(function (err) {
            throw err;
          });
      });
    });

    describe("POST", function () {
      before(async function () {});
      beforeEach(async function () {});
      afterEach(async function () {
        await Serial.deleteMany({});
      });

      it("Creates a serial", function () {
        const serialData = dataHelper.fakeSerialData();
        return chai
          .request(app)
          .post("/api/v1/serials")
          .set({ Authorization: "Bearer " + this.token })
          .send({ ...serialData, genre: this.testGenre })
          .then(function (res) {
            expect(res).to.have.status(201);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.key("data");
            expect(res.body.data.attributes).to.have.all.keys(
              "title",
              "synopsis",
              "slug",
              "nsfw",
              "creation_date"
            );
          })
          .catch(function (err) {
            throw err;
          });
      });
    });

    describe("PATCH", function () {
      before(async function () {
        this.testSerial = await dataHelper.seedSerial(
          this.testUser.id,
          this.testGenre.id
        );
      });
      beforeEach(async function () {});
      afterEach(async function () {
        await Serial.deleteMany({});
      });

      it("Updates a serial's metadata", function () {
        const testUpdateData = {
          serialId: this.testSerial.id,
          userId: this.testUser.id,
          title: "A new title",
          synopsis: "A new synopsis",
        };
        return chai
          .request(app)
          .patch("/api/v1/serials")
          .set({ Authorization: "Bearer " + this.token })
          .send(testUpdateData)
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.key("data");
            expect(res.body.data.attributes).to.have.all.keys(
              "title",
              "synopsis",
              "slug",
              "nsfw",
              "creation_date",
              "last_modified"
            );
          })
          .catch(function (err) {
            throw err;
          });
      });
    });
  });
});
