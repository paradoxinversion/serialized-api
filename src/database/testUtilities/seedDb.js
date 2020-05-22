const {
  User,
  Genre,
  Serial,
  SerialPart,
  Like,
  Report,
  Subscription,
} = require("../mongo/index");
const Faker = require("faker");
/**
 * This module seeds a database with a bunch of data for testing purposes.
 */

const seedDB = async () => {
  const userData = [];

  // make sure the admin is the first user
  const admin = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    birth_date: faker.date.between("01/01/1996", "01/01/1900"),
    join_date: Date.now(),
    role: 1,
  };

  userData.push(admin);

  // generate other users
  for (let i = 0; i < 10; i++) {
    const testUser = {
      username: faker.internet.userName,
      password: faker.internet.password,
      birth_date: faker.date.between("01/01/1950", "01/01/2000"),
      join_date: Date.now(),
      role: 0,
    };
    userData.push(testUser);
  }

  // Add users to the db
  const userDbInstances = userData.map(async (user) => {
    const seedUser = new User(user);
    return await seedUser.save();
  });

  // Create Some Genres
  const genreData = [];
  for (let i = 0; i < 5; i++) {
    const testGenre = {
      name: "Genre " + i,
      description: "A genre - " + i,
    };
    genreData.push(testGenre);
  }

  const genreDbInstances = genreData.map(async (genre) => {
    const seedGenre = new Genre(genre);
    return await seedGenre.save();
  });

  // Here we want to generate serials associated with users
  // We'll iterate over users, and then make serials within
  // those contexts
  const serialDbInstances = userDbInstances.map(async (author) => {
    const serialData = [];
    for (let i; i < 5; i++) {
      testSerial = {
        title: faker.random.words(),
        synopsis: faker.lorem.paragraph(),
        description: faker.lorem.paragraph(),
        nsfw: false,
        userId: author.id,
        genre: genreDbInstances[0].id, // should be more dynamic...
      };
      serialData.push(testSerial);
    }

    return serialData.map(async (serial) => {
      const seedSerial = new Serial(serial);
      return await seedSerial.save();
    });
  });
};

module.exports = seedDB;
