import mongoose from "mongoose";
import Role from "./mongo/Role";
const Config = require("../config/config").getConfig();

export default async function startClient()  {

  const mongooseOptions = {
    useMongoClient: true
  };
  console.log(Config);
  mongoose.Promise = global.Promise;
  await mongoose.connect(`mongodb://${Config.db.host}/${Config.db.database}`, mongooseOptions);
  const roles = await Role.find();
  try{
    if (roles.length === 0){
      const roles = [
        {role: "Reader", accessLevel: 0},
        {role: "Author", accessLevel: 1},
        {role: "Administrator", accessLevel: 2}
      ];
      const newRoles = await Role.insertMany(roles);
      console.log(newRoles);
    }
  } catch (error){
    throw error;
  }


}
