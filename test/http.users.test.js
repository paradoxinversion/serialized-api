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

describe("User API calls", function () {
  before(async function () {
    await dbHelpers.prepareTestDB();
  });
  describe("/users", function () {
    describe("POST /users", function () {
      before(async function () {
        await databaseInit();
      });
      it("Succeeds with code 201 if all information is properly included", async function () {
        const userSignup = dataHelper.fakeUserSignupData();
        return chai
          .request(app)
          .post("/api/v1/users")
          .send(userSignup)
          .then(function (res) {
            expect(res).to.have.status(201);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.key("data");
          })
          .catch(function (err) {
            throw err;
          });
      });

      it("Fails with a 400 if not all info is present", async function () {
        return chai
          .request(app)
          .post("/api/v1/users")
          .send({})
          .then(function (res) {
            expect(res).to.have.status(400);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.key("errors");
            expect(res.body.errors).to.be.an("array");
          })
          .catch(function (err) {
            throw err;
          });
      });
      after(async function () {
        await User.deleteMany({});
      });
    });

    describe("GET /users", function () {
      before(async function () {
        await databaseInit();
      });
      before(async function () {
        const {
          username,
          password,
          birthdate,
        } = dataHelper.fakeUserSignupData();
        const testUser = new User({
          username,
          password,
          birthdate,
          joinDate: Date.now(),
          role: 0,
        });
        await testUser.save();
      });
      after(async function () {
        await User.deleteMany({});
      });
      it("Returns an array of users", async function () {
        return chai
          .request(app)
          .get("/api/v1/users")
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.all.keys("data", "links");
          })
          .catch(function (err) {
            throw err;
          });
      });
    });

    describe("PUT /users", function () {
      before(async function () {
        await databaseInit();
        const {
          username,
          password,
          birthdate,
        } = dataHelper.fakeUserSignupData();
        const testUser = new User({
          username,
          password,
          birthdate,
          joinDate: Date.now(),
          role: 0,
        });
        this.user = await testUser.save();
        const payload = {
          username: this.user.username,
        };
        const signingOptions = {
          jwtid: faker.random.uuid(),
          expiresIn: "1 day",
          issuer: "serialized-test",
          audience: "serialized",
          subject: this.user.id,
        };
        this.token = app.locals.tokenManager.sign(payload, signingOptions);
      });
      after(async function () {
        await User.deleteMany({});
      });
      it("Updates a user", async function () {
        return chai
          .request(app)
          .patch("/api/v1/users")
          .set({ Authorization: "Bearer " + this.token })
          .send({ biography: "lol" })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.all.keys("data");
            expect(res.body.data.attributes.biography).to.eql("lol");
          })
          .catch(function (err) {
            throw err;
          });
      });

      it("Returns an error (403) if credentials aren't passed", async function () {
        return chai
          .request(app)
          .patch("/api/v1/users")
          .set({ Authorization: "" })
          .send({ basProperty: "lol" })
          .then(function (res) {
            expect(res).to.have.status(403);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.all.keys("errors");
          })
          .catch(function (err) {
            throw err;
          });
      });
    });

    describe("DELETE /users", function () {
      beforeEach(async function () {
        this.admin = await databaseInit();
        const {
          username,
          password,
          birthdate,
        } = dataHelper.fakeUserSignupData();
        const testUser = new User({
          username,
          password,
          birthdate,
          joinDate: Date.now(),
          role: 0,
        });
        this.testUser = await testUser.save();
        const payload = {
          username: this.admin.username,
        };
        const signingOptions = {
          jwtid: faker.random.uuid(),
          expiresIn: "1 day",
          issuer: "serialized-test",
          audience: "serialized",
          subject: this.admin.id,
        };
        this.token = app.locals.tokenManager.sign(payload, signingOptions);
      });
      afterEach(async function () {
        await User.deleteMany({});
      });

      it("Deletes a user when initiated by an admin", function () {
        return chai
          .request(app)
          .delete("/api/v1/users")
          .set({ Authorization: "Bearer " + this.token })
          .send({ userToDelete: this.testUser.id })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.all.keys("data");
          })
          .catch(function (err) {
            throw err;
          });
      });

      it("Throws a validation error when invalid user ids are passed", function () {
        return chai
          .request(app)
          .delete("/api/v1/users")
          .set({ Authorization: "Bearer " + this.token })
          .send({ userToDelete: "lol" })
          .then(function (res) {
            expect(res).to.have.status(400);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.all.keys("errors");
          })
          .catch(function (err) {
            throw err;
          });
      });
    });
  });

  describe("/user", function () {
    describe("GET", function () {
      beforeEach(async function () {
        const {
          username,
          password,
          birthdate,
        } = dataHelper.fakeUserSignupData();
        const testUser = new User({
          username,
          password,
          birthdate,
          joinDate: Date.now(),
          role: 0,
        });
        this.testUser = await testUser.save();
      });
      afterEach(async function () {
        await User.deleteMany({});
      });
      it("Returns a single user's data", function () {
        return chai
          .request(app)
          .get(`/api/v1/users/${this.testUser.username}`)
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res.type).to.eql("application/vnd.api+json");
            expect(res.body).to.have.all.key("data");
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
