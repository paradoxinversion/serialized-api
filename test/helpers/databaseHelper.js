import mongoose from "mongoose";
import Role from "../../src/database/mongo/Role";

export const prepareTestDB = async () => {
  const mongooseOptions = {
    useMongoClient: true
  };
  mongoose.Promise = global.Promise;
  mongoose.connect("mongodb://localhost/serialized_api_test", mongooseOptions);
  const roles = [
    {role: "Reader", accessLevel: 0},
    {role: "Author", accessLevel: 1},
    {role: "Administrator", accessLevel: 2}
  ];
  return await Role.insertMany(roles);
};

export const closeTestDBConnection = async () => {
  await mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
};
