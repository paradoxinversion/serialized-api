const mongoose = require("mongoose");
const User = require("./mongo/User");
const databaseInit = require("./databaseInit");

/**
 * Creates a mongoose database connection
 * @returns The mongoose db connection
 */
const startClient = async () => {
  try {
    return await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/serialized_api_dev",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );

    // const user = await User.findOne({ role: 2 });
    // if (!user) {
    //   await databaseInit();
    // }
  } catch (error) {
    throw error;
  }
};
module.exports = startClient;
