process.env.NODE_ENV = 'testing';
import {expect} from "chai";
import * as userActions from "../src/database/actions/user";
import User from "../src/database/mongo/User";
import * as authorization from "../src/controllers/auth";
import * as dataHelper from './helpers/dataHelper';
import * as dbHelpers from './helpers/databaseHelper';
/**
 * This function is a standin for the done() function utilized by passport.
 *
 */
const d = (error, user) => {
  if (error) throw error;
  if (user) return user;
  return null;
};
describe('User DB Actions', function(){
  before(async function (){
    console.log("Opening test DB for User Tests")
    await dbHelpers.prepareTestDB();
  });

  describe('AddNewUser', function(){
    it('Saves a new user to the DB', async function(){
      const newUser = await dataHelper.addUserHelper();
      return expect(newUser.dbResult.username).to.equal(newUser.requestBody.username);
    });
  });

  describe('getAllUsers', function(){
    before('Clear previous users from collection and add new ones', async function(){
      await User.remove({});
      await dataHelper.addUserHelper();
      await dataHelper.addUserHelper();
    });

    it ("Gets all users from the db", async function(){
      const userCount = await User.count({});
      return expect(userCount).to.equal(2);
    });

  });

  describe('Edit User', function(){
    let testUser;
    before('Clear previous users from collection and add new ones', async function(){
      await User.remove({});
      testUser = await dataHelper.addUserHelper();
    });

    it ("Modifies a user", async function(){
      const authorizedUser = await authorization.logUserIn(testUser.requestBody.email, testUser.requestBody.password, d);

      const requestBody = {
        "first-name": "freddy"
      };
      const userUpdate = await userActions.updateUser(requestBody, authorizedUser.token);
      return expect(userUpdate.firstName).to.equal("freddy");
    });
  });

  describe("Delete User", function(){
    let testUser;
    before('Clear previous users from collection and add new ones', async function(){
      await User.remove({});
      testUser = await dataHelper.addUserHelper();
    });

    it("Deletes a user if the requesting user provides the matching token", async function(){
      const authorizedUser = await authorization.logUserIn(testUser.requestBody.email, testUser.requestBody.password, d);
      await userActions.deleteUser(authorizedUser.token);
      const userCount = await User.count({});
      return expect(userCount).to.equal(0);
    });
  });

  after(async function (){
    console.log("Closing Test DB for User Tests");
    await dbHelpers.closeTestDBConnection();
  });
});
