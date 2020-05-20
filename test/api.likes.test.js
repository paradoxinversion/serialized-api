const { expect } = require("chai");
const userActions = require("../src/database/actions/user");
const likeActions = require("../src/database/actions/likes");
const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("Like DB Actions", function () {
  beforeEach(async function () {
    this.testDb = await dbHelpers.prepareTestDB();
  });

  afterEach(async function () {
    await this.testDb.connection.dropDatabase();
  });

  describe("createLike", function () {
    afterEach(async function () {
      await this.testDb.connection.dropDatabase();
    });

    it("Saves a new like to the DB", async function () {
      const testGenre = await dataHelper.seedGenre("Test", "A test genre");
      const testUser = await dataHelper.seedUser();
      const testUserTwo = await dataHelper.seedUser();
      const serial = await dataHelper.seedSerial(testUser.id, testGenre);

      const like = await likeActions.createLike(
        testUserTwo.id,
        "serial",
        serial.id
      );
      return expect(like.subject.toString()).to.equal(serial.id);
    });
  });

  describe("removeLike", function () {
    afterEach(async function () {
      await this.testDb.connection.dropDatabase();
    });

    it("Removes a like from a DB", async function () {
      const testGenre = await dataHelper.seedGenre("Test", "A test genre");
      const testUser = await dataHelper.seedUser();
      const testUserTwo = await dataHelper.seedUser();
      const serial = await dataHelper.seedSerial(testUser.id, testGenre);
      const like = await dataHelper.seedLike(
        testUserTwo.id,
        "serial",
        serial.id
      );
      const likeDeletion = await likeActions.removeLike(like.id);
      return expect(likeDeletion.subject.toString()).to.equal(serial.id);
    });
  });

  describe("getUserLikes", function () {
    afterEach(async function () {
      await this.testDb.connection.dropDatabase();
    });

    it("Retrives likes from the db", async function () {
      const testGenre = await dataHelper.seedGenre("Test", "A test genre");
      const testUser = await dataHelper.seedUser();
      const testUserTwo = await dataHelper.seedUser();
      const serial = await dataHelper.seedSerial(testUser.id, testGenre);
      const serialTwo = await dataHelper.seedSerial(testUser.id, testGenre);
      const like = await dataHelper.seedLike(
        testUserTwo.id,
        "serial",
        serial.id
      );
      const likeTwo = await dataHelper.seedLike(
        testUserTwo.id,
        "serial",
        serialTwo.id
      );
      const userLikes = await likeActions.getUserLikes(testUserTwo.id);
      expect(userLikes[0].subject.toString()).to.equal(serial.id);
      expect(userLikes[1].subject.toString()).to.equal(serialTwo.id);
    });
  });

  describe("getItemLikes", function () {
    afterEach(async function () {
      await this.testDb.connection.dropDatabase();
    });

    it("Gets like related to an item according to supplied type", async function () {
      const testGenre = await dataHelper.seedGenre("Test", "A test genre");
      const testUser = await dataHelper.seedUser();
      const testUserTwo = await dataHelper.seedUser();
      const serial = await dataHelper.seedSerial(testUser.id, testGenre);
      const serialTwo = await dataHelper.seedSerial(testUser.id, testGenre);
      const like = await dataHelper.seedLike(
        testUserTwo.id,
        "serial",
        serial.id
      );
      const likeTwo = await dataHelper.seedLike(
        testUserTwo.id,
        "serial",
        serialTwo.id
      );
      const likes = await likeActions.getItemLikes(serial.id);

      expect(likes).to.be.an.instanceOf(Array);
      expect(likes[0].subject.toString()).to.equal(serial.id);
    });
  });
  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
});
