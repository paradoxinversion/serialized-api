const {
  User,
  Genre,
  Serial,
  SerialPart,
  Like,
  Report,
  Subscription,
} = require("../mongo/index");
const bcrypt = require("bcrypt");
const faker = require("faker");
const _ = require("lodash");
/**
 * This module seeds a database with a bunch of data for testing purposes.
 */
const seedDB = async () => {
  try {
    const userData = [];

    // make sure the admin is the first user
    const admin = {
      username: "admin",
      password: await bcrypt.hash("admin", 10),
      birth_date: faker.date.between("01/01/1996", "01/01/1900"),
      join_date: Date.now(),
      biography: faker.lorem.paragraph(),
      role: 1,
    };
    const adminDoc = new User(admin);
    userData.push(await adminDoc.save());

    for (let i = 0; i < 10; i++) {
      const testUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        birth_date: faker.date.between("01/01/1950", "01/01/2000"),
        join_date: Date.now(),
        biography: faker.lorem.paragraph(),
        role: 0,
      };
      const testUserDoc = new User(testUser);
      userData.push(await testUserDoc.save());
    }

    // Create Some Genres
    const genreData = [];
    for (let i = 0; i < 5; i++) {
      const testGenre = {
        name: "Genre " + i,
        description: "A genre - " + i,
      };
      const seedGenre = new Genre(testGenre);
      genreData.push(await seedGenre.save());
    }

    // Here we want to generate serials associated with users.
    // We'll iterate over users, and then make serials within
    // those contexts
    const serialData = [];
    for (let a = 0; a < userData.length; a++) {
      for (let i = 0; i < 5; i++) {
        const title = faker.random.words();
        const created = faker.date.between("01/01/2010", "01/01/2021");
        const testSerial = {
          title,
          synopsis: faker.lorem.paragraph(),
          description: faker.lorem.paragraph(),
          nsfw: false,
          author: userData[a].id,
          genre: genreData[0].id,
          slug: _.kebabCase(title),
          creation_date: created,
          // should be more dynamic...
        };
        const seedSerial = new Serial(testSerial);
        serialData.push(await seedSerial.save());
      }
    }

    // Now, let's create parts for each of those serials
    const serialPartData = [];
    for (let s = 0; s < serialData.length; s++) {
      for (let i = 0; i < 5; i++) {
        const title = faker.random.words();
        const created = faker.date.between("01/01/2010", "01/01/2021");
        const testSerialPart = {
          title,
          content: faker.lorem.paragraph(),
          parent_serial: serialData[s].id,
          part_number: i,
          author: serialData[s].author,
          slug: _.kebabCase(title),
          creation_date: created,
          // should be more dynamic...
        };
        const seedSerialPart = new SerialPart(testSerialPart);
        serialPartData.push(await seedSerialPart.save());
      }
    }
  } catch (e) {
    throw e;
  }
};

module.exports = seedDB;
