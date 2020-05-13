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
/**
 * This function is a standin for the done() function utilized by passport.
 *
 */
const d = (error, user) => {
  if (error) throw error;
  if (user) return user;
  return null;
};

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
      const newUser = await userActions.addNewUser({ ...userData, role: 0 });
      return expect(newUser.username).to.equal(userData.username);
    });

    it("Fails when trying to add the same user twice", async function () {
      const userData = dataHelper.fakeUserSignupData();
      const newUser = await userActions.addNewUser({ ...userData, role: 0 });

      return expect(
        userActions.addNewUser({
          ...userData,
          role: 0,
        })
      ).to.eventually.be.rejected;
    });
  });

  describe("updateUser", async function () {
    it("Updates a user's bio and other info", async function () {
      const { username, password, birthdate } = dataHelper.fakeUserSignupData();
      const testUser = new User({
        username,
        password,
        birthdate,
        joinDate: Date.now(),
        role: 0,
      });
      await testUser.save();
      let updateData = {
        biography: faker.lorem.paragraph(),
        viewNSFW: true,
        userId: testUser.id,
      };
      const updatedUser = await userActions.updateUser(updateData);
      expect(updatedUser.biography).to.equal(updateData.biography);
      expect(updatedUser.viewNSFW).to.equal(true);
    });
  });

  describe("deleteUser", async function () {
    it("Deletes a user from thhe databse", async function () {
      const { username, password, birthdate } = dataHelper.fakeUserSignupData();
      const testUser = new User({
        username,
        password,
        birthdate,
        joinDate: Date.now(),
        role: 0,
      });
      await testUser.save();

      const deletedUser = await userActions.deleteUser(testUser.id);
      expect(deletedUser.result).to.equal(1);
    });
    it("Throws a error when a user cannot be deleted", async function () {
      const { username, password, birthdate } = dataHelper.fakeUserSignupData();
      const testUser = new User({
        username,
        password,
        birthdate,
        joinDate: Date.now(),
        role: 0,
      });
      await testUser.save();

      // expect(userActions.deleteUser(undefined)).to.eventually.throw;
      expect(userActions.deleteUser(undefined)).to.be.rejected;
    });
  });

  describe("getAllUsers", async function () {
    it("Returns a specified amount of users", async function () {
      const testUsers = [];
      for (let i = 0; i < 99; i++) {
        const testUser = dataHelper.fakeUserSignupData();
        testUsers.push(testUser);
      }

      for await (let testUserData of testUsers) {
        const testUser = new User({
          username: testUserData.username,
          password: testUserData.password,

          birthdate: testUserData.birthdate,
          joinDate: Date.now(),
          role: 0,
        });
        await testUser.save();
      }
      const users = await userActions.getAllUsers(0, 30);
      expect(users.users).to.have.lengthOf(30);
    });
    it("Returns all registered users", async function () {
      const testUsers = [];
      for (let i = 0; i < 99; i++) {
        const testUser = dataHelper.fakeUserSignupData();
        testUsers.push(testUser);
      }

      for await (let testUserData of testUsers) {
        const testUser = new User({
          username: testUserData.username,
          password: testUserData.password,

          birthdate: testUserData.birthdate,
          joinDate: Date.now(),
          role: 0,
        });
        await testUser.save();
      }
      const users = await userActions.getAllUsers(0, 100);
      expect(users.users).to.have.lengthOf(100);
    });
    it("Skips users as directed", async function () {
      const testUsers = [];
      for (let i = 0; i < 99; i++) {
        const testUser = dataHelper.fakeUserSignupData();
        testUsers.push(testUser);
      }

      for await (let testUserData of testUsers) {
        const testUser = new User({
          username: testUserData.username,
          password: testUserData.password,

          birthdate: testUserData.birthdate,
          joinDate: Date.now(),
          role: 0,
        });
        await testUser.save();
      }
      const startIndex = 30;
      const users = await userActions.getAllUsers(startIndex);

      expect(users.users[0].username).to.eq(testUsers[startIndex - 1].username);
    });
  });

  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
});
