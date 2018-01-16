process.env.NODE_ENV = 'testing';
import mongoose from "mongoose";
import {expect} from "chai";
import bcrypt from "bcrypt";
import * as userActions from "../src/database/actions/user";
import Role from "../src/database/mongo/Role";
import User from "../src/database/mongo/User";
import * as authorization from "../src/controllers/auth";

const addNewUserHelper = async (email, username, password, firstName, lastName, birthdate) => {
  const requestBody = {
    email: email,
    username: username,
    password: password,
    'first-name': firstName,
    'last-name': lastName,
    birthdate: birthdate
  };
  return await userActions.addNewUser(requestBody);
};

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
  before(function (done){
    // Initialize the DB and invoke done once connected
    const mongooseOptions = {
      useMongoClient: true
    };
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/tdb", mongooseOptions);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, 'connection error'));
    db.once('open', function(){
      const roles = [
        {role: "Reader", accessLevel: 0},
        {role: "Author", accessLevel: 1},
        {role: "Administrator", accessLevel: 2}
      ];
      Role.insertMany(roles, (error)  =>{
        if (error) console.log(error);
      });
      console.log("Connected to DB");
      done();
    });
  });

  describe('AddNewUser', function(){
    it('Saves a new user to the DB', async function(){
      const newUser = await addNewUserHelper("a@a.com", "a", "aaa", "a", "a", "01/01/1999");
      return expect(newUser.username).to.equal("a");
    });
  });

  describe('getAllUsers', function(){
    before('Clear previous users from collection and add new ones', async function(){
      await User.remove({});
      await addNewUserHelper(
        "test@test.com",
        "test",
        "tEsT",
        "Testy",
        "McTest",
        "01/01/1999"
      );
      await addNewUserHelper(
        "toot@test.com",
        "test",
        "TeSt",
        "Testy",
        "McTest",
        "01/01/1999"
      );
    });

    it ("Gets all users from the db", async function(){
      const userCount = await User.count({});
      return expect(userCount).to.equal(2);
    });

  });

  describe('Edit User', function(){

    before('Clear previous users from collection and add new ones', async function(){
      await User.remove({});
      await addNewUserHelper(
        "test@test.com",
        "test",
        "testpassword",
        "Testy",
        "McTest",
        "01/01/1999"
      );
    });

    it ("Modifies a user", async function(){
      const authorizedUser = await authorization.logUserIn("test@test.com", "testpassword", d);

      const requestBody = {
        "first-name": "freddy"
      };
      const userUpdate = await userActions.updateUser(requestBody, authorizedUser.token);
      return expect(userUpdate.firstName).to.equal("freddy");
    });
  });

  after(function (done){
    console.log("Tests Complete");
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done);
    });
  });
});
