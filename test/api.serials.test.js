const { expect } = require("chai");
const serialActions = require("../src/database/actions/serial");
const serialPartActions = require("../src/database/actions/serialPart");
const Serial = require("../src/database/mongo/Serial");
const User = require("../src/database/mongo/User");
const Genre = require("../src/database/mongo/Genre");
const dbHelpers = require("./helpers/databaseHelper");
const dataHelper = require("./helpers/dataHelper");
const databaseInit = require("../src/database/databaseInit");
const _ = require("lodash");

describe("Serial Actions", function () {
  before(async function () {
    await dbHelpers.prepareTestDB();
    const [admin, testUser, testUserTwo, testGenre] = await Promise.all([
      dbHelpers.prepareTestDB(),
      databaseInit(),
      dataHelper.seedUser(),
      dataHelper.seedUser(),
      dataHelper.seedGenre("Test Genre", "A genre for testing."),
    ]);
    this.admin = admin;
    this.testUser = testUser;
    this.testUserTwo = testUserTwo;
    this.testGenre = testGenre;
  });
  afterEach(async function () {
    await Serial.deleteMany({});
  });
  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });

  describe("serialActions", function () {
    describe("createSerial", function () {
      it("creates a serial", async function () {
        const serialData = dataHelper.fakeSerialData(
          this.testUser.id,
          this.testGenre.id
        );
        const serial = await serialActions.createSerial(serialData);
        expect(serial.title).to.eql(serialData.title);
      });
    });

    describe("getSerials", function () {
      before(async function () {
        this.serials = await dataHelper.seedSerials(
          this.testUser.id,
          this.testGenre.id,
          99
        );
      });

      it("reads all serial data", async function () {
        const serials = await serialActions.getSerials(0, 99, true);
        expect(serials).to.have.length(99);
      });
    });

    describe("update serial", function () {
      before(async function () {
        this.testSerial = await dataHelper.seedSerial(
          this.testUser.id,
          this.testGenre.id
        );
      });

      it("Updates a serial with new data", async function () {
        const testUpdateData = {
          serialId: this.testSerial.id,
          userId: this.testUser.id,
          title: "A new title",
          synopsis: "A new synopsis",
        };
        const updated = await serialActions.editSerial(testUpdateData);
        expect(updated.title).to.eql("A new title");
        expect(updated.synopsis).to.eql("A new synopsis");
      });
    });

    describe("delete serial", function () {
      beforeEach(async function () {
        this.testSerial = await dataHelper.seedSerial(
          this.testUser.id,
          this.testGenre.id
        );
      });
      this.afterEach(async function () {
        await Serial.deleteMany({});
      });
      it("Deletes a serial, if initiated by the owner", async function () {
        const deleted = await serialActions.deleteSerial({
          serialId: this.testSerial.id,
          userId: this.testUser.id,
        });
        debugger;
        expect(deleted.deletedSerial.id).to.eql(this.testSerial.id);
      });
      it("Deletes a serial, with multiple parts", async function () {
        const newSerial = await dataHelper.seedSerial(
          this.testUser.id,
          this.testGenre
        );
        const serialPartOne = await dataHelper.seedSerialPart(newSerial, 1);
        const serialPartTwo = await dataHelper.seedSerialPart(newSerial, 2);
        const serialPartThree = await dataHelper.seedSerialPart(newSerial, 3);
        const deleted = await serialActions.deleteSerial({
          serialId: newSerial.id,
          userId: this.testUser.id,
        });

        expect(deleted.deletedParts.n).to.eql(3);
        expect(deleted.deletedSerial.id).to.eql(newSerial.id);
      });
    });
  });
});
