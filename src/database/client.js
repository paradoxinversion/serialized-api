import mongoose from "mongoose";
import Role from "./mongo/Role";
import databaseInit from "./databaseInit";
export default async function startClient() {
  mongoose.Promise = global.Promise;
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/serialized_api_dev"
    );
    const roles = await Role.find();

    if (roles.length === 0) {
      // const roles = [
      //   { role: "Reader", accessLevel: 0 },
      //   { role: "Author", accessLevel: 1 },
      //   { role: "Administrator", accessLevel: 2 }
      // ];
      // await Role.insertMany(roles);
      console.log("Initializing the Database with roles and admin user.");
      await databaseInit();
      return mongoose;
    } else {
      console.log("got roles...");
    }
  } catch (error) {
    throw error;
  }
}
