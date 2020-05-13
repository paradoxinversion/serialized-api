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
    const userOne = dataHelper.fakeUserSignupData();
    const userTwo = dataHelper.fakeUserSignupData();
    const testUser = new User({
      username: userOne.username,
      password: userOne.password,
      birthdate: userOne.birthdate,
      joinDate: Date.now(),
      role: 0,
    });
    const testUserTwo = new User({
      username: userTwo.username,
      password: userTwo.password,
      birthdate: userTwo.birthdate,
      joinDate: Date.now(),
      role: 0,
    });
    this.admin = await databaseInit();
    this.testUser = await testUser.save();
    this.testUserTwo = await testUserTwo.save();
    const testGenre = new Genre({
      name: "Test Genre",
      description: "A genre for testing.",
    });
    await testGenre.save();
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
        const { title, synopsis, nsfw } = dataHelper.fakeSerialData();
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
        const { title, synopsis, nsfw } = dataHelper.fakeSerialData();
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
      });
      this.afterEach(async function () {
        await Serial.deleteMany({});
      });
      it("Deletes a serial, if initiated by the owner", async function () {
        const deleted = await serialActions.deleteSerial({
          serialId: this.testSerial.id,
          userId: this.testUser.id,
        });
        expect(deleted.serialId).to.eql(this.testSerial.id);
      });

      it("Fails if the user is not the owner or an adminn", async function () {
        // const deleted = await serialActions.deleteSerial({
        //   serialId: this.testSerial.id,
        //   userId: this.testUserTwo.id,
        // });
        expect(
          serialActions.deleteSerial({
            serialId: this.testSerial.id,
            userId: this.testUserTwo.id,
          })
        ).to.eventually.be.rejected;
      });
    });
  });
});
