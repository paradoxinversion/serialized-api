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
    const { username, password, birthdate } = dataHelper.fakeUserSignupData();
    const testUser = new User({
      username,
      password,
      birthdate,
      joinDate: Date.now(),
      role: 0,
    });

    this.admin = await databaseInit();
    this.testUser = await testUser.save();

    const testGenre = new Genre({
      name: "Test Genre",
      description: "A genre for testing.",
    });
    await testGenre.save();
    this.testGenre = testGenre;
  });
  beforeEach(async function () {});
  afterEach(async function () {
    await Serial.deleteMany({});
  });
  after(async function () {
    await dbHelpers.closeTestDBConnection();
  });

  describe("serialActions", function () {
    describe("createSerial", function () {
      it("creates a serial", async function () {
        const serialData = dataHelper.fakeSerialData();
        const serial = await serialActions.createSerial({
          ...serialData,
          userId: this.testUser.id,
          genre: this.testGenre.id,
        });
        expect(serial.title).to.eql(serialData.title);
      });
    });

    describe("read serial", function () {
      before(async function () {
        const testSerials = [];
        for (let i = 0; i < 99; i++) {
          const testSerial = dataHelper.fakeSerialData();
          testSerials.push(testSerial);
        }
        for await (let testSerialData of testSerials) {
          const { title, synopsis, nsfw } = testSerialData;
          const testSerial = new Serial({
            title,
            synopsis,
            genre: this.testGenre.id,
            nsfw,
            creation_date: Date.now(),
            author: this.testUser.id,
            slug: _.kebabCase(title),
          });
          this.testSerial = await testSerial.save();
        }
      });

      it("reads all serial data", async function () {
        const serialData = dataHelper.fakeSerialData();
        const serials = await serialActions.getSerials();
        expect(serials).to.have.length(99);
      });
    });

    describe("update serial", function () {
      before(async function () {
        const testSerials = [];
        for (let i = 0; i < 99; i++) {
          const testSerial = dataHelper.fakeSerialData();
          testSerials.push(testSerial);
        }
        for await (let testSerialData of testSerials) {
          const { title, synopsis, nsfw } = testSerialData;
          const testSerial = new Serial({
            title,
            synopsis,
            genre: this.testGenre.id,
            nsfw,
            creation_date: Date.now(),
            author: this.testUser.id,
            slug: _.kebabCase(title),
          });
          this.testSerial = await testSerial.save();
        }
      });

      it("reads all serial data", async function () {
        const serialData = dataHelper.fakeSerialData();
        const serials = await serialActions.getSerials();
        expect(serials).to.have.length(99);
      });
    });
  });
});
