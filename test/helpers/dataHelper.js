import faker from "faker";
import * as userActions from "../../src/database/actions/user";
import * as serialActions from "../../src/database/actions/serial";
import * as _ from "lodash";

export const addUserHelper = async () => {

  const requestBody = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    'first-name': faker.name.firstName(),
    'last-name': faker.name.lastName(),
    birthdate: faker.date.between("01/01/1996", "01/01/1900")
  };

  const dbResult =  await userActions.addNewUser(requestBody);
  return {
    requestBody,
    dbResult
  };
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

export const addSerialPartHelper = () => {
  
}
