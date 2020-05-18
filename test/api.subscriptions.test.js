const { expect } = require("chai");
const subscriptionActions = require("../src/database/actions/subscription");
const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("Subscription DB Actions", function () {
  beforeEach(async function () {
    this.testDb = await dbHelpers.prepareTestDB();
  });

  afterEach(async function () {
    await this.testDb.connection.dropDatabase();
  });

  describe("createSubscription", function () {
    afterEach(async function () {
      await this.testDb.connection.dropDatabase();
    });

    it("Saves a subscription to the DB", async function () {
      const testGenre = await dataHelper.seedGenre("Test", "A test genre");
      const testUser = await dataHelper.seedUser();
      const testUserTwo = await dataHelper.seedUser();
      const serial = await dataHelper.seedSerial(testUser.id, testGenre);

      const subscription = await subscriptionActions.createSubscription(
        testUserTwo.id,
        "serial",
        serial.id
      );

      expect(subscription.subscribed_object.toString()).to.equal(serial.id);
    });
  });

  describe("removeSubscription", function () {
    afterEach(async function () {
      await this.testDb.connection.dropDatabase();
    });

    it("Saves a subscription to the DB", async function () {
      const testGenre = await dataHelper.seedGenre("Test", "A test genre");
      const testUser = await dataHelper.seedUser();
      const testUserTwo = await dataHelper.seedUser();
      const serial = await dataHelper.seedSerial(testUser.id, testGenre);
      const subscription = await dataHelper.seedSubscription(
        testUserTwo.id,
        "serial",
        serial.id
      );
      const subscriptionRemoval = await subscriptionActions.removeSubscription(
        subscription.id
      );

      expect(subscriptionRemoval.subscribed_object.toString()).to.equal(
        serial.id
      );
    });
  });

  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
});
