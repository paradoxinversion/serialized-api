process.env.NODE_ENV = 'testing';
import {expect} from "chai";
import * as serialActions from "../src/database/actions/serial"
import * as serialPartActions from "../src/database/actions/serialPart";
import Serial from "../src/database/mongo/Serial";
import * as authorization from "../src/controllers/auth";
import * as dbHelpers from './helpers/databaseHelper';
import * as dataHelper from './helpers/dataHelper';

/**
 * This function is a standin for the done() function utilized by passport.
 *
 */
const d = (error, user) => {
  if (error) throw error;
  if (user) return user;
  return null;
};
describe('Serial Actions', function(){
  let authorizedUser;
  let testSerial;
  before(async function (){
    await dbHelpers.prepareTestDB();
    const authorizedUserData = await dataHelper.addUserHelper();
    authorizedUser = await authorization.logUserIn(authorizedUserData.requestBody.email, authorizedUserData.requestBody.password, d);
  });

  describe('Add Serials', function(){

    context ("When a user provides proper credentials", function(){
      it('Adds a serial to the Database', async function(){
        testSerial = await dataHelper.addSerialHelper(authorizedUser);
        return expect(testSerial.dbResult.title).to.equal(testSerial.requestBody.title);
      });
    });
  });

  describe('Edit Serials', function(){
    context ("When a user provides proper credentials", function(){
      it('Accepts edits to the title of the serial', async function(){
        const requestBody = {
          title: "New Title",
          synopsis: "A new story"
        };
        const editResult = await serialActions.editSerial(requestBody, testSerial.dbResult._id, authorizedUser.token);
        return expect(editResult.title).to.equal("New Title");
      });

    });
  });

  describe('Delete Serial', function(){
    context ("When a user provides proper credentials", function(){
      it('Removes the provided serial', async function(){
        await serialActions.deleteSerial(testSerial.dbResult._id, authorizedUser.token);
        return expect(await Serial.find()).to.eql([]);
      });

    });
  });

  after(async function (){
    await dbHelpers.closeTestDBConnection();
  });
});
