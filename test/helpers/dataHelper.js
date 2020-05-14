const faker = require("faker");
const User = require("../../src/database/mongo/User");
const Genre = require("../../src/database/mongo/Genre");
const Serial = require("../../src/database/mongo/Serial");
const SerialPart = require("../../src/database/mongo/SerialPart");
const _ = require("lodash");
/**
 * Create use data mimicing a signup
 */
const fakeUserSignupData = (role = 0) => {
  const userData = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    birthdate: faker.date.between("01/01/1996", "01/01/1900"),
    joinDate: Date.now(),
    role: 0,
  };

  return userData;
};

/**
 * Create an array of testUserData
 * @param {*} amt
 */
const createTestUsers = (amt) => {
  const testUsers = [];
  for (let i = 0; i < amt; i++) {
    const testUser = {
      username: faker.internet.userName,
      password: faker.internet.password,
      birthdate: faker.date.between("01/01/1950", "01/01/2000"),
      joinDate: Date.now(),
    };
    testUsers.push(testUser);
  }
  return testUsers;
};

/**
 * Add a fake user to the database for testing
 * @param {*} role
 */
const seedUser = async (role = 0) => {
  const userSignupData = fakeUserSignupData();
  const user = new User({ ...userSignupData, role });

  return await user.save();
};
/**
 * Add a fake user to the database for testing
 * @param {*} role
 */
const seedUsers = async (amt) => {
  const users = [];
  for (let i = 0; i < amt; i++) {
    const testUserData = fakeUserSignupData();
    users.push(testUserData);
  }
  const seededUsers = [];
  for await (let testUserData of users) {
    const testUser = new User({
      username: testUserData.username,
      password: testUserData.password,
      birthdate: testUserData.birthdate,
      joinDate: Date.now(),
      role: 0,
    });
    await testUser.save();
    seededUsers.push(testUser);
  }
  return seededUsers;
};

/**
 * Creates fake data for a user update request
 */
const fakeUserUpdateRequest = (userId, viewNSFW) => {
  const updateData = {
    viewNSFW,
    biography: faker.lorem.paragraph(),
    userId,
  };

  return updateData;
};

/**
 * Creates fake data for seeding serials
 */
const fakeSerialData = (userId, genre) => {
  const serialData = {
    title: faker.random.words(),
    synopsis: faker.lorem.paragraph(),
    description: faker.lorem.paragraph(),
    nsfw: false,
    userId,
    genre,
  };

  return serialData;
};

/**
 *
 * @param {String} authoringUser - the database id of the user who owns the serial
 */
const seedSerial = async (authoringUser, genre) => {
  const { title, synopsis, nsfw } = fakeSerialData();
  const serial = new Serial({
    title,
    synopsis,
    genre,
    nsfw,
    author: authoringUser,
    creation_date: Date.now(),
    slug: _.kebabCase(title),
  });
  await serial.save();
  return serial;
};

const seedSerials = async (authoringUser, genre, amt) => {
  const serials = [];
  for (let x = 0; x < amt; x++) {
    const serial = await seedSerial(authoringUser, genre);
    serials.push(serial);
  }
  return serials;
};

/**
 * Create some fake data for a serial part for testing/seeding
 */
const fakeSerialPartData = (serial, partNumber) => {
  const serialPartData = {
    title: faker.random.words(),
    content: faker.lorem.paragraphs(5),
    creation_date: Date.now(),
    last_updated: Date.now(),
    parent_serial: serial.id,
    slug: _.kebabCase(title),
    part_number: partNumber,
    author: serial.author,
  };
  return serialPartData;
};

const seedSerialPart = async (serial, partNumber) => {
  const serialPartData = fakeSerialData(serial, partNumber);
  const serialPart = new SerialPart(serialPartData);
  await serialPart.save();
  return serialPart;
};

const seedGenre = async (name, description) => {
  const genre = new Genre({
    name,
    description,
  });
  await genre.save();
  return genre;
};

const fakeTokenSigningData = (user) => {
  const payload = {
    username: user.username,
  };
  const signingOptions = {
    jwtid: faker.random.uuid(),
    expiresIn: "1 day",
    issuer: "serialized-test",
    audience: "serialized",
    subject: user.id,
  };

  return {
    payload,
    signingOptions,
  };
};

const signFakeToken = (tokenManager, user) => {
  const { payload, signingOptions } = fakeTokenSigningData(user);
  return tokenManager.sign(payload, signingOptions);
};
module.exports = {
  createTestUsers,
  fakeUserSignupData,
  fakeUserUpdateRequest,
  fakeSerialData,
  seedSerial,
  seedUser,
  seedUsers,
  fakeSerialPartData,
  seedSerialPart,
  fakeTokenSigningData,
  signFakeToken,
  seedGenre,
  seedSerials,
};
