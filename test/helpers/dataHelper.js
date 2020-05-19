const faker = require("faker");
const User = require("../../src/database/mongo/User");
const Genre = require("../../src/database/mongo/Genre");
const Serial = require("../../src/database/mongo/Serial");
const SerialPart = require("../../src/database/mongo/SerialPart");
const Like = require("../../src/database/mongo/Like");
const Report = require("../../src/database/mongo/Report");
const Subscription = require("../../src/database/mongo/Subscription");
const _ = require("lodash");
/**
 * Create use data mimicing a signup
 */
const fakeUserSignupData = (role = 0) => {
  const userData = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    birth_date: faker.date.between("01/01/1996", "01/01/1900"),
    join_date: Date.now(),
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
      birth_date: faker.date.between("01/01/1950", "01/01/2000"),
      join_date: Date.now(),
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
      birth_date: testUserData.birth_date,
      join_date: Date.now(),
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
  try {
    const serials = [];
    for (let x = 0; x < amt; x++) {
      const serial = await seedSerial(authoringUser, genre);
      serials.push(serial);
    }
    return serials;
  } catch (e) {
    throw e;
  }
};

/**
 * Create some fake data for a serial part for testing/seeding
 * @param {Object} - the serial (object) that this part a part of
 */
const fakeSerialPartData = (serial) => {
  const title = faker.random.words();
  const serialPartData = {
    title,
    content: faker.lorem.paragraphs(5),
    creation_date: Date.now(),
    last_modified: Date.now(),
    parent_serial: serial.id,
    slug: _.kebabCase(title),
    author: serial.author,
  };
  return serialPartData;
};

/**
 * Create soem fake data for updating a serial
 * @param {*} serial
 */
const fakeSerialPartUpdateData = (partId) => {
  const serialPartData = {
    partId,
    title: faker.random.words(),
    content: faker.lorem.paragraphs(5),
  };
  return serialPartData;
};

/**
 * Seed the db with a serial part for testing
 * @param {Object} serial - A serial object from the db
 */
const seedSerialPart = async (serial, part_number) => {
  try {
    const serialPartData = fakeSerialPartData(serial);
    const serialPart = new SerialPart({ ...serialPartData, part_number });
    await serialPart.save();
    return serialPart;
  } catch (e) {
    throw e;
  }
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

/**
 *
 * @param {String} reportType - describes what the thing is (ie, serial, user, etc)
 * @param {String} subject - mongo object id
 * @param {String} details - user input
 * @param {String} reporter - mongo objectid
 */
const makeFakeReport = async (reportType, subject, details, reporter) => {
  const fakeReport = new Report({
    report_type: reportType,
    reported_item: subject,
    extra_details: details,
    reporting_user: reporter,
  });

  await fakeReport.save();
  return fakeReport;
};

const seedLike = async (userId, type, subject) => {
  const fakeLike = new Like({
    like_type: type,
    subject,
    user: userId,
  });
  await fakeLike.save();
  return fakeLike;
};

const seedSubscription = async (userId, type, subject) => {
  const fakeSubscription = new Subscription({
    subscriber: userId,
    subscribed_object: subject,
    subscription_type: type,
  });
  await fakeSubscription.save();
  return fakeSubscription;
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
  fakeSerialPartUpdateData,
  makeFakeReport,
  seedLike,
  seedSubscription,
};
