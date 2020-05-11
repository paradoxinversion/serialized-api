const { expect } = require("chai");
const serialActions = require("../src/database/actions/serial");
const serialPartActions = require("../src/database/actions/serialPart");
const Serial = require("../src/database/mongo/Serial");
const User = require("../src/database/mongo/User");

const dbHelpers = require("./helpers/databaseHelper");
const dataHelper = require("./helpers/dataHelper");
const databaseInit = require("../src/database/databaseInit");

describe("Serial Actions", function () {
  before(async function () {
    await dbHelpers.prepareTestDB();
  });
  beforeEach(async function () {
    await databaseInit();
    const { username, password, birthdate } = dataHelper.fakeUserSignupData();
    const testUser = new User({
      username,
      password,
      birthdate,
      joinDate: Date.now(),
      role: 0,
    });
  });
  afterEach(async function () {
    await Serial.remove({});
  });
  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });

  describe("serialActions", function(){
    describe("createSerial", function(){
      it("creates a serial", async function(){
        const serialData = dataHelper.fakeSerialData()
        serialActions.createSerial()
      })
    })
  })
});
