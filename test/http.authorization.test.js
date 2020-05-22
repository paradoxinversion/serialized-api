const { expect } = require("chai");
const userActions = require("../src/database/actions/user");
const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const databaseInit = require("../src/database/databaseInit");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.use(chaiAsPromised);

const app = require("../src/app");
describe("Authorization API Tests", function () {
  describe("/log-in", function () {
    context("POST", function () {
      it("logs a user in", async function () {
        return chai
          .request(app)
          .post(`/api/v1/log-in`)
          .send({ username: "admin", password: "admin" })
          .then(function (res) {
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
});
