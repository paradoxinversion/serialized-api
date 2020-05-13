const faker = require("faker");
const serialActions = require("../../src/database/actions/serial");
const serialPartActions = require("../../src/database/actions/serialPart");
const User = require("../src/database/mongo/User");

/**
 * Create use data mimicing a signup
 */
const fakeUserSignupData = () => {
  const userData = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    birthdate: faker.date.between("01/01/1996", "01/01/1900"),
  };

  return userData;
};

/**
 * Add a fake user to the database for testing
 * @param {*} role
 */
const seedUser = async (role) => {
  const { username, password, birthdate } = dataHelper.fakeUserSignupData();
  const user = new User({
    username,
    password,
    birthdate,
    joinDate: Date.now(),
    role,
  });

  return await user.save();
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
    };
    testUsers.push(testUser);
  }
  return testUsers;
};

const fakeUserUpdateRequest = () => {
  const requestBody = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    biography: faker.lorem.paragraph(),
  };

  return requestBody;
};

const fakeSerialData = () => {
  const serialData = {
    title: faker.random.words(),
    synopsis: faker.lorem.paragraph(),
    description: faker.lorem.paragraph(),
    nsfw: false,
  };

  return serialData;
};

const addSerialPartHelper = (parentSerialId) => {
  const requestBody = {
    title: faker.random.words(),
    content: faker.random.paragraph(),
  };

  const dbResult = serialPartActions.createSerialPart(
    requestBody,
    parentSerialId
  );
  return {
    requestBody,
    dbResult,
  };
};
module.exports = {
  createTestUsers,
  fakeUserSignupData,
  fakeUserUpdateRequest,
  fakeSerialData,
  addSerialPartHelper,
};
