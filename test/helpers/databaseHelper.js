const mongoose = require("mongoose");
const databaseInit = require("../../src/database/databaseInit");
const prepareTestDB = async () => {
  const mongooseOptions = {
    useMongoClient: true,
  };
  const db = await mongoose.connect(
    "mongodb://localhost:27017/serialized_api_test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  return db;
};

const closeTestDBConnection = async () => {
  await mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
};
module.exports = { prepareTestDB, closeTestDBConnection };
