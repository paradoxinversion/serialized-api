const chai = require("chai");
const { expect } = require("chai");
const Serial = require("../src/database/mongo/Serial");
const SerialPart = require("../src/database/mongo/SerialPart");
const User = require("../src/database/mongo/User");

const {
  createSerialPart,
  readSerialParts,
  getSingleSerialPart,
  updateSerialPart,
  updateSerialPartNumber,
  deleteSerialPart,
} = require("../src/database/actions/serialPart");
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

  describe("readSerialParts", function () {
    it("Gets all parts of a serial", async function () {
      await dataHelper.seedSerialPart(this.testSerial, 1);
      await dataHelper.seedSerialPart(this.testSerial, 2);
      const serialPart = await readSerialParts(this.testSerial.id);
      expect(serialPart).to.have.length(2);
    });
  });

  describe("getSingleSerialPart", function () {
    it("Gets a single serial part", async function () {
      await dataHelper.seedSerialPart(this.testSerial, 1);
      const part = await dataHelper.seedSerialPart(this.testSerial, 2);
      const serialPart = await getSingleSerialPart(part.id);
      debugger;
      expect(serialPart.title).to.eql(part.title);
      expect(serialPart.author.username).to.eql(this.testUser.username);
    });
  });

  describe("updateSerialPart", function () {
    it("Updates a serial part", async function () {
      await dataHelper.seedSerialPart(this.testSerial, 1);
      const part = await dataHelper.seedSerialPart(this.testSerial, 2);
      const partUpdateData = dataHelper.fakeSerialPartUpdateData(part.id);
      const serialPart = await updateSerialPart(partUpdateData);
      debugger;
      expect(serialPart.title).to.eql(partUpdateData.title);
      expect(serialPart.content).to.eql(partUpdateData.content);
    });
  });

  describe("updateSerialPartNumber", function () {
    it("Updates a serial part", async function () {
      const partOne = await dataHelper.seedSerialPart(this.testSerial, 1);
      const partTwo = await dataHelper.seedSerialPart(this.testSerial, 2);
      const serialPart = await updateSerialPartNumber({
        serialPartId: partOne.id,
        moveUp: true,
      });
      expect(serialPart.part_number).to.eql(2);
    });
  });

  describe("deleteSerialPart", function () {
    it("Deletes a serial part from the db", async function () {
      const partOne = await dataHelper.seedSerialPart(this.testSerial, 1);
      const partTwo = await dataHelper.seedSerialPart(this.testSerial, 2);
      const deletionResult = await deleteSerialPart(
        partOne.id,
        this.testUser.id
      );
      expect(deletionResult.title).to.eql(partOne.title);
    });
  });
});
