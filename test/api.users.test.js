process.env.NODE_ENV = "testing";
import faker from "faker";
import {expect} from "chai";
import * as userActions from "../src/database/actions/user";
import User from "../src/database/mongo/User";
import Role from "../src/database/mongo/Role";
import * as authorization from "../src/controllers/auth";
import * as dataHelper from "./helpers/dataHelper";
import * as dbHelpers from "./helpers/databaseHelper";
/**
 * This function is a standin for the done() function utilized by passport.
 *
 */
const d = (error, user) => {
  if (error) throw error;
  if (user) return user;
  return null;
};

describe("User DB Actions", function(){
  before(async function (){
    await dbHelpers.prepareTestDB();
  });

  describe("addNewUser", function(){
    it("Saves a new user to the DB", async function(){
      const signUpReq = dataHelper.fakeUserSignupRequest();
      const newUser = await userActions.addNewUser(signUpReq);
      return expect(newUser.username).to.equal(signUpReq.username.toLowerCase());
    });
  });

  describe("updateUser", async function(){
    
    it ("Updates a user's first name, last name, or bio", async function(){
      const role = await Role.findOne({accessLevel: 0});
      const testUser = new User({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        birthdate: faker.date.between("01/01/1996", "01/01/1900"),
        joinDate: Date.now(),
        role: role._id
      });
      await testUser.save();
      const updateReq = dataHelper.fakeUserUpdateRequest();
      const updatedUser = await userActions.updateUser(updateReq, testUser._id);
      expect(updatedUser.firstName).to.equal(updateReq.firstName);
      expect(updatedUser.lastName).to.equal(updateReq.lastName);
      expect(updatedUser.biography).to.equal(updateReq.biography);
    });
  });
  describe("getAllUsers", async function(){
    
    it ("Returns all registered users", async function(){
      const role = await Role.findOne({accessLevel: 0});
      const testUser = new User({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        birthdate: faker.date.between("01/01/1996", "01/01/1900"),
        joinDate: Date.now(),
        role: role._id
      });
      await testUser.save();
      const users = await userActions.getAllUsers();
      expect(users.length).to.be.greaterThan(0);
    });
  });
  
  after(async function (){
    await dbHelpers.closeTestDBConnection();
  });
});
