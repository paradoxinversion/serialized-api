const faker = require("faker");
const serialActions = require("../../src/database/actions/serial");
const serialPartActions = require("../../src/database/actions/serialPart");

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
const fakeUserSignupData = () => {
  const userData = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    birthdate: faker.date.between("01/01/1996", "01/01/1900"),
  };

  return userData;
};

const fakeUserUpdateRequest = () => {
  const requestBody = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    biography: faker.lorem.paragraph(),
  };

  return requestBody;
};

const addSerialHelper = async (user) => {
  const requestBody = {
    title: faker.random.words(),
    synopsis: faker.lorem.paragraph(),
    genre: faker.random.word(),
    description: faker.lorem.paragraph(),
    nsfw: false,
  };

  const dbResult = await serialActions.postSerial(requestBody, user.token);
  return {
    requestBody,
    dbResult,
  };
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
  addSerialHelper,
  addSerialPartHelper,
};
