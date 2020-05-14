const faker = require("faker");
const { expect } = require("chai");
const userActions = require("../src/database/actions/user");
const User = require("../src/database/mongo/User");
const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const databaseInit = require("../src/database/databaseInit");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("User DB Actions", function () {
  before(async function () {
    await dbHelpers.prepareTestDB();
  });
  beforeEach(async function () {
    await databaseInit();
  });
  afterEach(async function () {
    await User.deleteMany({});
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
      expect(updatedUser.viewNSFW).to.equal(true);
    });
  });

  describe("deleteUser", async function () {
    it("Deletes a user from thhe databse", async function () {
      const testUser = await dataHelper.seedUser();
      const deletedUser = await userActions.deleteUser(testUser.id);
      expect(deletedUser.result).to.equal(1);
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
      expect(users.users[0].username).to.eq(testUsers[startIndex - 1].username);
    });
  });

  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
});
