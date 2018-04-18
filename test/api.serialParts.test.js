process.env.NODE_ENV = "testing";
import {expect} from "chai";
import Serial from "../src/database/mongo/Serial";
import * as authorization from "../src/controllers/auth";
import * as dbHelpers from "./helpers/databaseHelper";
import * as dataHelper from "./helpers/dataHelper";

/**
 * This function is a standin for the done() function utilized by passport.
 *
 */
const d = (error, user) => {
  if (error) throw error;
  if (user) return user;
  return null;
};
describe("Serial Parts", function(){
 
  

 
});
