const chai = require("chai");
const { expect } = require("chai");
const Serial = require("../src/database/mongo/Serial");
const SerialPart = require("../src/database/mongo/SerialPart");
const User = require("../src/database/mongo/User");

const { createSerialPart } = require("../src/database/actions/serialPart");
const dataHelper = require("./helpers/dataHelper");
const dbHelpers = require("./helpers/databaseHelper");
const databaseInit = require("../src/database/databaseInit");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe("Serial Parts DB functions", function () {
  before(async function () {
    this.dbConnection = await dbHelpers.prepareTestDB();
  });
  beforeEach(async function () {
    // Create a random user and serial
    this.testGenre = await dataHelper.seedGenre(
      "Test Genre",
      "A genre for testing."
    );
    this.testUser = await dataHelper.seedUser();
    this.testSerial = await dataHelper.seedSerial(
      this.testUser.id,
      this.testGenre.id
    );
  });
  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });
  afterEach(async function () {
    // Drop the database after each test
    await this.dbConnection.connection.db.dropDatabase();
  });

  describe("createSerialPart", function () {
    it("Creates a serial part", async function () {
      const serialPartData = dataHelper.fakeSerialPartData(this.testSerial);
      const serialPart = await createSerialPart({
        ...serialPartData,
        parentSerial: this.testSerial,
      });
      expect(serialPart.title).to.eql(serialPartData.title);
      expect(serialPart.content).to.eql(serialPartData.content);
    });
  });

  describe("createSerialPart", function () {
    it("Creates a serial part", async function () {
      const serialPartData = dataHelper.fakeSerialPartData(this.testSerial);
      const serialPart = await createSerialPart({
        ...serialPartData,
        parentSerial: this.testSerial,
      });
      expect(serialPart.title).to.eql(serialPartData.title);
      expect(serialPart.content).to.eql(serialPartData.content);
    });
  });
});
