import mongoose from "mongoose";
import Role from "./mongo/Role";
const Config = require("../config/config").getConfig();

export default async function startClient()  {

  const mongooseOptions = {
    useMongoClient: true
  };
  mongoose.Promise = global.Promise;
  try{
    await mongoose.connect(process.env.MONGODB_URI || `mongodb://${Config.db.host}/${Config.db.database}`, mongooseOptions);
    const roles = await Role.find();
  
    if (roles.length === 0){
      const roles = [
        {role: "Reader", accessLevel: 0},
        {role: "Author", accessLevel: 1},
        {role: "Administrator", accessLevel: 2}
      ];
      await Role.insertMany(roles);
      return mongoose;
    }
  } catch (error){
    throw error;
  }
}
