const { expect } = require("chai");
const userActions = require("../src/database/actions/user");
const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("User DB Actions", function () {
  beforeEach(async function () {
    this.testDb = await dbHelpers.prepareTestDB();
  });

  afterEach(async function () {
    await this.testDb.connection.dropDatabase();
  });

  describe("addNewUser", function () {
    it("Saves a new user to the DB", async function () {
      const userData = dataHelper.fakeUserSignupData();
      const newUser = await userActions.addNewUser(userData);
      return expect(newUser.username).to.equal(userData.username);
    });

    it("Fails when trying to add the same user twice", async function () {
      const userData = dataHelper.fakeUserSignupData();
      await userActions.addNewUser(userData);
      return expect(userActions.addNewUser(userData)).to.eventually.be.rejected;
    });
  });

  describe("updateUser", async function () {
    it("Updates a user's bio and other info", async function () {
      const testUser = await dataHelper.seedUser();
      const updateData = dataHelper.fakeUserUpdateRequest(testUser.id, true);
      const updatedUser = await userActions.updateUser(updateData);
      expect(updatedUser.biography).to.equal(updateData.biography);
      expect(updatedUser.view_nsfw).to.equal(true);
    });
  });

  describe("deleteUser", async function () {
    it("Deletes a user from the database", async function () {
      const testUser = await dataHelper.seedUser();
      const deletionResult = await userActions.deleteUser(testUser.id);
      expect(deletionResult.userDeletion.id).to.equal(testUser.id);
    });

    it("Deletes a user and their content from the database", async function () {
      const testUser = await dataHelper.seedUser();
      const testGenre = await dataHelper.seedGenre("Test", "A test genre");
      const testSerial = await dataHelper.seedSerial(testUser.id, testGenre);
      const testPart = await dataHelper.seedSerialPart(testSerial, 1);
      const deletionResult = await userActions.deleteUser(testUser.id);
      debugger;
      expect(deletionResult.userDeletion.id).to.equal(testUser.id);
      expect(deletionResult.contentDeletion).to.have.length(1);
      expect(deletionResult.contentDeletion[0].deletedParts.n).to.eql(1);
      expect(deletionResult.contentDeletion[0].deletedSerial.id).to.eql(
        testSerial.id
      );
    });
    it("Throws a error when a user cannot be deleted", async function () {
      await dataHelper.seedUser();
      expect(userActions.deleteUser(undefined)).to.be.rejected;
    });
  });

  describe("getAllUsers", async function () {
    it("Returns a specified amount of users", async function () {
      await dataHelper.seedUsers(99);
      const users = await userActions.getAllUsers(0, 30);
      expect(users.users).to.have.lengthOf(30);
    });

    it("Returns all registered users", async function () {
      await dataHelper.seedUsers(100);
      const users = await userActions.getAllUsers(0, 100);
      expect(users.users).to.have.lengthOf(100);
    });

    it("Skips users as directed", async function () {
      const testUsers = await dataHelper.seedUsers(100);
      const startIndex = 30;
      const users = await userActions.getAllUsers(startIndex);
      expect(users.users[0].username).to.eq(testUsers[startIndex].username);
    });
  });

  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
});
