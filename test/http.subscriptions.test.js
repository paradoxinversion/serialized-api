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

describe("Subscription API calls", function () {
  describe("/serial-subscriptions/:serialId/", function () {
    context("POST /serial-subscriptions/:serialId/", function () {
      beforeEach(async function () {
        this.testDb = await dbHelpers.prepareTestDB();
      });
      afterEach(async function () {
        this.testDb.connection.dropDatabase();
      });
      it("Succeeds with code 201", async function () {
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
          .post(`/api/v1/serial-subscriptions/${serial.id}`)
          .set({ Authorization: "Bearer " + token })
          .send({ user: userTwo.id, type: "serial", subject: serial.id })
          .then(function (res) {
            expect(res).to.have.status(201);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.key("data");
          })
          .catch(function (err) {
            throw err;
          });
      });
    });

    context("DELETE /serial-subscriptions/:serialId/", function () {
      beforeEach(async function () {
        this.testDb = await dbHelpers.prepareTestDB();
      });
      afterEach(async function () {
        this.testDb.connection.dropDatabase();
      });
      it("Succeeds with code 200", async function () {
        const userOne = await dataHelper.seedUser();
        const userTwo = await dataHelper.seedUser();
        const genre = await dataHelper.seedGenre("Test", "A test genre");
        const serial = await dataHelper.seedSerial(userOne.id, genre);
        const subscription = await dataHelper.seedSubscription(
          userTwo.id,
          "serial",
          serial
        );
        const token = await dataHelper.signFakeToken(
          app.locals.tokenManager,
          userTwo
        );
        return chai
          .request(app)
          .delete(`/api/v1/serial-subscriptions/${serial.id}`)
          .set({ Authorization: "Bearer " + token })
          .send({ subscriptionId: subscription.id })
          .then(function (res) {
            expect(res).to.have.status(200);
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
  });

  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
});
