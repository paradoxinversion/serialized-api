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
  beforeEach(async function () {
    this.testDb = await dbHelpers.prepareTestDB();
  });
  afterEach(async function () {
    this.testDb.connection.dropDatabase();
  });
  describe("/users", function () {
    context("POST /users", function () {
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
    });

    context("GET /users", function () {
      it("Returns an array of users", async function () {
        await User.deleteMany({});
        await databaseInit();
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

    context("PUT /users", function () {
      before(async function () {
        this.user = await dataHelper.seedUser();
        this.token = dataHelper.signFakeToken(
          app.locals.tokenManager,
          this.user
        );
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

    context("DELETE /users", function () {
      beforeEach(async function () {
        this.admin = await databaseInit();
        this.testUser = await dataHelper.seedUser();
        this.token = dataHelper.signFakeToken(
          app.locals.tokenManager,
          this.admin
        );
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
    context("GET", function () {
      beforeEach(async function () {
        this.testUser = await dataHelper.seedUser();
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
