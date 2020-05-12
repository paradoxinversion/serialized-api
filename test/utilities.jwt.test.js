const TokenManager = require("../src/tokens/jwt");
const User = require("../src/database/mongo/User");
const jwt = require("jsonwebtoken");

const faker = require("faker");

const { expect } = require("chai");
describe("TokenGenerator", function () {
  before(async function () {
    this.tokenGen = new TokenManager("test", "test");
  });

  describe("Sign", function () {
    it("signs a jwt", async function () {
      const signingOptions = {
        jwtid: faker.random.uuid(),
        expiresIn: "1m",
        issuer: "serialized-test",
        audience: "serialized",
        subject: "1",
      };
      const payload = {
        username: "test_mctestish",
      };
      const token = this.tokenGen.sign(payload, signingOptions);
      const verifiedToken = this.tokenGen.verify(token, "test", {
        complete: true,
      });
      expect(token).to.match(/.+\..+\..+/);
    });
  });

  // I have minor concerns about this test, as it relies on a function we're testing (the sign fn)
  describe("Refresh", function () {
    before(async function () {
      const signingOptions = {
        jwtid: faker.random.uuid(),
        expiresIn: "1m",
        issuer: "serialized-test",
        audience: "serialized",
        subject: "1",
      };
      const payload = {
        username: "test_mctestish",
      };
      this.token = this.tokenGen.sign(payload, signingOptions);
    });
    after(async function () {
      delete this.token;
    });

    it("refreshes a jwt", async function () {
      const refreshingOptions = {
        jwtid: faker.random.uuid(),
      };

      const refreshed = this.tokenGen.refresh(this.token, refreshingOptions);
      expect(refreshed).to.match(/.+\..+\..+/);
    });
  });
});
