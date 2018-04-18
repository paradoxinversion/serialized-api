process.env.NODE_ENV = "testing";
import faker from "faker";
import {expect} from "chai";
import * as userActions from "../src/database/actions/user";
import User from "../src/database/mongo/User";
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

  describe("updateUser", function(){
    it ("Updates a user's first name, last name, or bio", function(){
      
    });
  });

  after(async function (){
    await dbHelpers.closeTestDBConnection();
  });
});
