// process.env.NODE_ENV = 'testing';
// import {expect} from "chai";
// import * as serialActions from "../src/database/actions/serial"
// import * as serialPartActions from "../src/database/actions/serialPart";
// import Serial from "../src/database/mongo/Serial";
// import * as authorization from "../src/controllers/auth";
// import * as dbHelpers from './helpers/databaseHelper';
// import * as dataHelper from './helpers/dataHelper';

// /**
//  * This function is a standin for the done() function utilized by passport.
//  *
//  */
// const d = (error, user) => {
//   if (error) throw error;
//   if (user) return user;
//   return null;
// };
// describe('Serial Actions', function(){
//   let authorizedUser;
//   let testSerial;
//   before(async function (){
//     await dbHelpers.prepareTestDB();
//     const authorizedUserData = await dataHelper.addUserHelper();
//     authorizedUser = await authorization.logUserIn(authorizedUserData.requestBody.email, authorizedUserData.requestBody.password, d);
//   });

//   after(async function (){
//     await dbHelpers.closeTestDBConnection();
//   });
// });
