import faker from "faker";
import * as serialActions from "../../src/database/actions/serial";
import * as serialPartActions from "../../src/database/actions/serialPart";


export const fakeUserSignupRequest = () => {

  const requestBody = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    birthdate: faker.date.between("01/01/1996", "01/01/1900")
  };

  return requestBody;
};

export const fakeUserUpdateRequest = () => {

  const requestBody = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    biography: faker.lorem.paragraph()
  };

  return requestBody;
};

export const addSerialHelper = async (user) => {
  const requestBody = {
    title: faker.random.words(),
    synopsis: faker.lorem.paragraph(),
    genre: faker.random.word(),
    description: faker.lorem.paragraph(),
    nsfw: false
  };

  const dbResult = await serialActions.postSerial(requestBody, user.token);
  return {
    requestBody,
    dbResult
  };
};

export const addSerialPartHelper = (parentSerialId) => {
  const requestBody = {
    title: faker.random.words(),
    content: faker.random.paragraph(),
  };

  const dbResult = serialPartActions.createSerialPart(requestBody, parentSerialId);
  return {
    requestBody,
    dbResult
  };
};
