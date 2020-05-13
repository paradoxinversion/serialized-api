const chai = require("chai");
const chaiHttp = require("chai-http");

const faker = require("faker");
const { expect } = require("chai");
const User = require("../src/database/mongo/User");
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
    this.admin = await databaseInit();

    const { username, password, birthdate } = dataHelper.fakeUserSignupData();
    const testUser = new User({
      username,
      password,
      birthdate,
      joinDate: Date.now(),
      role: 0,
    });

    this.testUser = await testUser.save();

    const testGenre = new Genre({
      name: "Test Genre",
      description: "A genre for testing.",
    });
    await testGenre.save();
    this.testGenre = testGenre;

    const payload = {
      username: this.testUser.username,
    };
    const signingOptions = {
      jwtid: faker.random.uuid(),
      expiresIn: "1 day",
      issuer: "serialized-test",
      audience: "serialized",
      subject: this.testUser.id,
    };
    this.token = app.locals.tokenManager.sign(payload, signingOptions);
  });
  describe("/serials", function () {
    describe("GET", function () {
      before(async function () {
        const testGenre = new Genre({
          name: "Test Genre",
          description: "A genre for testing.",
        });
        await testGenre.save();
        this.testGenre = testGenre;
        const testSerials = [];
        for (let i = 0; i < 10; i++) {
          const testSerial = dataHelper.fakeSerialData();
          testSerials.push(testSerial);
        }
        for await (let testSerialData of testSerials) {
          const { title, synopsis, nsfw } = testSerialData;
          const testSerial = new Serial({
            title,
            synopsis,
            genre: this.testGenre.id,
            nsfw,
            creation_date: Date.now(),
            author: this.testUser.id,
            slug: _.kebabCase(title),
          });
          this.testSerial = await testSerial.save();
        }
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
        const { title, synopsis, nsfw } = dataHelper.fakeSerialData();
        const testSerial = new Serial({
          title,
          synopsis,
          genre: this.testGenre.id,
          nsfw,
          creation_date: Date.now(),
          author: this.testUser.id,
          slug: _.kebabCase(title),
        });
        this.testSerial = await testSerial.save();
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
